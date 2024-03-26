<script lang="ts">
  import { melt, type TreeView } from '@melt-ui/svelte'
  import { draggable } from '../lib/dnd'
  import { isShown, type BaseNode } from '../lib/fs'
  import { getContext } from 'svelte'
  import { ChevronDownIcon, ChevronRightIcon } from '@krowten/svelte-heroicons'
  import { dndStore } from '../lib/stores'
  import Tree from './tree.svelte'

  export let node: BaseNode
  export let level: number

  const {
    elements: { item, group },
    helpers: { isExpanded }
  } = getContext<TreeView>('tree')

  let itemId = node.relative_path
  let folder = node.type === 'folder'
  let hasChildren = node.type === 'folder' && !!node.children.length
  let name = node.type === 'file' ? node.name.slice(0, -node.extension.length) : node.name

  let btnClass: string
  $: {
    if ($dndStore.dragNode?.relative_path === itemId) {
      btnClass = 'text-text bg-primary/80'
    } else if ($dndStore.dragging) {
      btnClass = 'text-text/70'
    } else {
      btnClass = 'text-text/70 hover:bg-text/10 hover:text-text'
    }
  }

  let liClass: string
  $: {
    liClass = level !== 1 ? 'pl-4' : ''
    if ($dndStore.dropNode?.relative_path === itemId) {
      liClass += ' bg-primary/10 rounded-md'
    }
  }
</script>

{#if isShown(node)}
  <li class={liClass} use:draggable={node}>
    <button
      class="flex items-center gap-1 rounded-md px-2 py-1 w-full {btnClass}"
      use:melt={$item({
        id: itemId,
        hasChildren
      })}
    >
      <!-- Icon -->
      {#if folder && $isExpanded(itemId)}
        <ChevronDownIcon class="size-3" />
      {:else if folder}
        <ChevronRightIcon class="size-3" />
      {:else}
        <div class="size-3" />
      {/if}

      <span class="select-none text-sm">{name}</span>
    </button>

    {#if node.type === 'folder' && hasChildren}
      <ul use:melt={$group({ id: itemId })}>
        <Tree treeItems={node.children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/if}

<style>
  /* Remove docs' focus box-shadow styling. */
  li:focus {
    box-shadow: none !important;
  }
</style>
