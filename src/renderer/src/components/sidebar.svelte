<script lang="ts">
  import { createTreeView } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  import Tree from './tree.svelte'
  import type { BaseNode } from '../lib/fs'
  import { dndStore, expandedStore, treeStore } from '../lib/stores'
  import { basezone, draggable } from '../lib/dnd'

  const ctx = createTreeView({
    expanded: expandedStore,
    onExpandedChange: ({ curr, next }) => ($dndStore.dragging ? curr : next)
  })
  setContext('tree', ctx)

  const {
    elements: { tree }
  } = ctx

  const folders = window.electron.ipcRenderer.invoke('get_folders') as Promise<BaseNode>
  folders.then((data) => {
    treeStore.set(data)
  })
</script>

<div
  class="h-lvh flex flex-col bg-bg text-text w-[300px]"
>
  {#if $treeStore && $treeStore.type === 'folder'}
    <ul class="h-full px-4 pb-4 pt-4" {...$tree}>
      <div class="h-full l-lvh" use:basezone={$treeStore}>
        <div class={`${$dndStore.dropNode && !$dndStore.dropNode.parent ? 'bg-primary/10 rounded-md' : ''} pt-2`} use:draggable={$treeStore}>
          <p class="uppercase tracking-widest text-xs font-semibold text-text/70 pl-6 mb-1">Notes</p>
          <Tree treeItems={$treeStore.children} />
        </div>
      </div>
    </ul>
  {/if}
</div>
