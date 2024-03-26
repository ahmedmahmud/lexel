<script context="module" lang="ts">
  import {
    BeakerIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ArrowLeftIcon
  } from '@krowten/svelte-heroicons'
  type Icon = 'svelte' | 'folder' | 'js'

  export type TreeItem = {
    title: string
    icon: Icon
    children?: TreeItem[]
  }

  export const icons = {
    svelte: BeakerIcon,
    folder: ChevronRightIcon,
    folderOpen: ChevronDownIcon,
    js: BeakerIcon,
    highlight: ArrowLeftIcon
  }
</script>

<script lang="ts">
  import { melt, type TreeView } from '@melt-ui/svelte'
  import { getContext } from 'svelte'
  import { draggable } from '../lib/dnd2'
  import type { BaseNode } from '../lib/fs'

  export let treeItems: BaseNode[]
  export let level = 1

  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected }
  } = getContext<TreeView>('tree')
</script>

{#each treeItems as node}
  {@const itemId = node.relative_path}
  {@const folder = node.type === 'folder'}
  {@const hasChildren = node.type === 'folder' && !!node.children.length}

  <li class={level !== 1 ? 'pl-4' : ''} use:draggable={node}>
    <button
      class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
      use:melt={$item({
        id: itemId,
        hasChildren
      })}
    >
      <!-- Icon -->
      {#if folder && $isExpanded(itemId)}
        <svelte:component this={icons['folderOpen']} class="h-4 w-4" />
      {:else if folder}
        <svelte:component this={icons['folder']} class="h-4 w-4" />
      {:else}
        <!-- <svelte:component this={icons[folder.extension]} class="h-4 w-4" /> -->
      {/if}

      <span class="select-none">{node.name}</span>

      <!-- Selected icon -->
      {#if $isSelected(itemId)}
        <svelte:component this={icons['highlight']} class="h-4 w-4" />
      {/if}
    </button>

    {#if node.type === 'folder' && hasChildren}
      <ul use:melt={$group({ id: itemId })}>
        <svelte:self treeItems={node.children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}

<style>
  /* Remove docs' focus box-shadow styling. */
  li:focus {
    box-shadow: none !important;
  }
</style>
