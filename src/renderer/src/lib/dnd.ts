import { addToast } from '../components/toaster.svelte'
import { isDescendant, type BaseNode } from './fs'
import { dndStore, type DndState, treeStore, expandedStore } from './stores'

const MIN_MOVEMENT_BEFORE_DRAG_START_PX = 3

export function draggable(el: HTMLElement, data_: BaseNode) {
  let data: BaseNode = data_
  let state: DndState
  let held: number

  function addMaybeListeners() {
    window.addEventListener('mousemove', handleMouseMoveMaybeDragStart, { passive: false })
    window.addEventListener('touchmove', handleMouseMoveMaybeDragStart, {
      passive: false,
      capture: false
    })
    window.addEventListener('mouseup', handleFalseAlarm, { passive: false })
    window.addEventListener('touchend', handleFalseAlarm, { passive: false })
  }

  function removeMaybeListeners() {
    window.removeEventListener('mousemove', handleMouseMoveMaybeDragStart)
    window.removeEventListener('touchmove', handleMouseMoveMaybeDragStart)
    window.removeEventListener('mouseup', handleFalseAlarm)
    window.removeEventListener('touchend', handleFalseAlarm)
  }

  function handleMouseDown(e) {
    // on safari clicking on a select element doesn't fire mouseup at the end of the click and in general this makes more sense
    if (
      e.target !== e.currentTarget &&
      (e.target.value !== undefined || e.target.isContentEditable)
    ) {
      return
    }
    // prevents responding to any button but left click which equals 0 (which is falsy)
    if (e.button) {
      return
    }
    if (state.dragging) {
      return
    }
    e.stopPropagation()
    const c = e.touches ? e.touches[0] : e
    dndStore.update((state) => ({ ...state, startPos: { x: c.clientX, y: c.clientY } }))
    dndStore.update((state) => ({ ...state, currentPos: { x: c.clientX, y: c.clientY } }))
    addMaybeListeners()
  }

  function handleMouseMoveMaybeDragStart(e) {
    e.preventDefault()
    const c = e.touches ? e.touches[0] : e
    const currentPos = { x: c.clientX, y: c.clientY }
    if (
      Math.abs(currentPos.x - state.startPos.x) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX ||
      Math.abs(currentPos.y - state.startPos.y) >= MIN_MOVEMENT_BEFORE_DRAG_START_PX
    ) {
      dndStore.update((state) => ({ ...state, currentPos }))
      removeMaybeListeners()
      handleDragStart()
    }
  }

  function handleFalseAlarm() {
    removeMaybeListeners()
  }

  function handleDragStart() {
    dndStore.update((state) => ({
      ...state,
      dragging: true,
      dragElement: el,
      dragNode: data,
      dropElement: null,
      dropNode: null
    }))

    // handing over to global handlers - starting to watch the element
    window.addEventListener('mousemove', handleMouseMove, { passive: false })
    window.addEventListener('touchmove', handleMouseMove, { passive: false, capture: false })
    window.addEventListener('mouseup', handleDrop, { passive: false })
    window.addEventListener('touchend', handleDrop, { passive: false })

    const evt = new Event('mouseover', { bubbles: true })
    el.dispatchEvent(evt)
  }

  function handleMouseMove(e) {
    e.preventDefault()
    const c = e.touches ? e.touches[0] : e
    const currentMousePosition = { x: c.clientX, y: c.clientY }
    dndStore.update((state) => ({ ...state, currentPos: currentMousePosition }))
  }

  async function handleDrop() {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleMouseMove)
    window.removeEventListener('mouseup', handleDrop)
    window.removeEventListener('touchend', handleDrop)

    if (state.dropNode && state.dropNode.relative_path !== data.parent.relative_path) {
      console.log('move', data.relative_path, state.dropNode?.relative_path)
      // @ts-ignore
      const res = (await window.electron.ipcRenderer.invoke(
        'move_node',
        data.relative_path,
        state.dropNode?.relative_path,
        data.name
      )) as { ok: true; value: BaseNode } | { ok: false; error: Error }
      if (res.ok === true) {
        treeStore.set(res.value)
        expandedStore.update((items) => {
          if (!items.includes(data.relative_path)) {
            items.push(data.relative_path)
          }
          return items
        })
      } else {
        const errorMessage = res.error.message.replace('ENOENT: ', '').split(',')[0]
        addToast({
          data: {
            title: 'Move failed',
            description: errorMessage,
            color: 'red'
          }
        })
      }
    }

    // use requestAnimationFrame so `draggable: false` blocks click event of tree
    requestAnimationFrame(() => {
      dndStore.set({
        dragging: false,
        dragElement: null,
        dropElement: null,
        dragNode: null,
        dropNode: null,
        startPos: null,
        currentPos: null,
        clickAllowed: false
      })
    })
  }

  function handleMouseEnter(e) {
    if (data.type === 'file') return

    held = window.setTimeout(() => {
      expandedStore.update((items) => {
        if (!items.includes(data.relative_path)) {
          items.push(data.relative_path)
        }
        return items
      })
    }, 500)

    e.stopPropagation()
    if (!isDescendant(data, state.dragNode)) {
      dndStore.update((state) => ({ ...state, dropElement: e.currentTarget, dropNode: data }))
      el.classList.add('bg-red-400/20')
    }
  }

  function handleMouseLeave(e) {
    if (data.type === 'file') return

    window.clearTimeout(held)

    e.stopPropagation()
    if (!isDescendant(data, state.dragNode)) {
      dndStore.update((state) => {
        if (state.dropElement === e.currentTarget) {
          return { ...state, dropElement: null, dropNode: null }
        }
        return state
      })
      el.classList.remove('bg-red-400/20')
    }
  }

  const unsubscribe = dndStore.subscribe((store) => {
    state = store
    if (store.dragging) {
      el.addEventListener('mouseover', handleMouseEnter)
      el.addEventListener('mouseout', handleMouseLeave)
    } else {
      el.removeEventListener('mouseover', handleMouseEnter)
      el.removeEventListener('mouseout', handleMouseLeave)
      el.classList.remove('bg-red-400/20')
    }
  })

  // dont allow dragging of root
  if (data.parent) {
    el.addEventListener('mousedown', handleMouseDown)
  }

  return {
    update(newData: BaseNode) {
      data = newData
    },
    destroy() {
      el.removeEventListener('mousedown', handleMouseDown)
      unsubscribe()

      // just in case
      el.removeEventListener('mouseover', handleMouseEnter)
      el.removeEventListener('mouseout', handleMouseLeave)
    }
  }
}

export function basezone(el: HTMLElement, data: BaseNode) {
  let child = el.children[0] as HTMLElement
  let held: number;
  let state: DndState;

  function handleMouseEnter(e) {
    if (data.type === 'file') return

    held = window.setTimeout(() => {
      expandedStore.update((items) => {
        if (!items.includes(data.relative_path)) {
          items.push(data.relative_path)
        }
        return items
      })
    }, 500)

    e.stopPropagation()
    if (!isDescendant(data, state.dragNode)) {
      dndStore.update((state) => ({ ...state, dropElement: e.currentTarget, dropNode: data }))
      child.classList.add('bg-red-400/20')
      console.log(child, child.classList)
    }
  }

  function handleMouseLeave(e) {
    if (data.type === 'file') return

    window.clearTimeout(held)

    e.stopPropagation()
    if (!isDescendant(data, state.dragNode)) {
      dndStore.update((state) => {
        if (state.dropElement === e.currentTarget) {
          return { ...state, dropElement: null, dropNode: null }
        }
        return state
      })
      child.classList.remove('bg-red-400/20')
    }
  }

  const unsubscribe = dndStore.subscribe((store) => {
    state = store
    if (store.dragging) {
      el.addEventListener('mouseover', handleMouseEnter)
      el.addEventListener('mouseout', handleMouseLeave)
    } else {
      el.removeEventListener('mouseover', handleMouseEnter)
      el.removeEventListener('mouseout', handleMouseLeave)
      child.classList.remove('bg-red-400/20')
    }
  })

  return {
    update(newData: BaseNode) {
      data = newData
    },
    destroy() {
      unsubscribe()
      // just in case
      el.removeEventListener('mouseover', handleMouseEnter)
      el.removeEventListener('mouseout', handleMouseLeave)
    }
  }
}