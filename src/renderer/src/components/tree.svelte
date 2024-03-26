<script lang="ts">
  import { isShown, type BaseNode } from '../lib/fs'
  import TreeNode from './tree-node.svelte'

  export let treeItems: BaseNode[]
  export let level = 1
</script>

{#each treeItems as node (node.relative_path)}
  {#if isShown(node)}
    <TreeNode {node} {level} />
  {/if}
{/each}
