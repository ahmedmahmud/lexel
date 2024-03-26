<script>
  import { dndStore } from '../lib/stores'
</script>

{#if $dndStore.dragging}
  <div
    id="tooltip"
    class="fixed pointer-events-none z-50 bg-green-300 shadow-md rounded-md p-1"
    style="top: {$dndStore.currentPos.y}px; left: {$dndStore.currentPos.x}px"
  >
    <div class="flex items-center gap-2 text-base ">
      <!-- todo: add icon -->
      {$dndStore.dragNode.name}
    </div>
    {#if $dndStore.dropNode}
      <div class="text-sm">
        Move into "{$dndStore.dropNode.name}"
      </div>
    {/if}
  </div>
{/if}
