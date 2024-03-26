<script lang="ts">
  import { createTreeView } from '@melt-ui/svelte'
  import { setContext } from 'svelte'

  import Tree from './tree.svelte'
  import type { BaseNode } from '../lib/fs'
  import { dndStore, expandedStore, treeStore } from '../lib/stores'

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
  class="flex h-[18.75rem] w-[18.75rem] flex-col rounded-xl bg-white text-neutral-900 md:h-[350px]"
>
  {#if $treeStore && $treeStore.type === 'folder'}
    <ul class="px-4 pb-4 pt-2" {...$tree}>
      <Tree treeItems={$treeStore.children} />
    </ul>
  {/if}
</div>
