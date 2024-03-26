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
  class="h-lvh flex flex-col rounded-xl bg-white text-neutral-900"
>
  {#if $treeStore && $treeStore.type === 'folder'}
    <ul class="h-full px-4 pb-4 pt-2" {...$tree}>
      <div class="h-full l-lvh" use:basezone={$treeStore}>
        <div use:draggable={$treeStore}>
          Notes
          <Tree treeItems={$treeStore.children} />
        </div>
      </div>
    </ul>
  {/if}
</div>
