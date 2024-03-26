<script>
  import { DocumentIcon, FolderIcon } from '@krowten/svelte-heroicons'
  import { dndStore } from '../lib/stores'
</script>

{#if $dndStore.dragging}
  <div
    id="tooltip"
    class="fixed pointer-events-none z-50 bg-bg_h shadow-xl rounded-md px-2 py-1"
    style="top: {$dndStore.currentPos.y}px; left: {$dndStore.currentPos.x}px"
  >
    <p class="flex items-center gap-1 text-sm text-fg">
      <!-- todo: add icon -->
      {#if $dndStore.dragNode.type === 'file'}
        <DocumentIcon class="size-3" />
      {:else}
        <FolderIcon class="size-3" />
      {/if}
      {$dndStore.dragNode.name}
    </p>
    {#if $dndStore.dropNode}
      <p class="text-xs text-fg1/80">
        Move into "{$dndStore.dropNode.name}"
      </p>
    {/if}
  </div>
{/if}
