export function draggable(node, data) {
  let state = data;

  node.draggable = true;
  node.style.cursor = 'grab';

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', state);
    // event.dataTransfer.dropEffect = 'move';
  }
  node.addEventListener('dragstart', handleDragStart);
  return {
    update(data) {
      state = data;
    },
    destroy() {
      node.removeEventListener('dragstart', handleDragStart);
    }
  }
}

export function dropzone(node, options) {
  let state = {
    dropEffect: 'move',
    dragover_class: 'bg-red-400/20',
    ...options,
  }

  function handleDragEnter(event) {
    event.target.classList.add(state.dragover_class);
  }
  function handleDragLeave(event) {
    event.target.classList.remove(state.dragover_class);
  }
  node.addEventListener('dragenter', handleDragEnter);
  node.addEventListener('dragleave', handleDragLeave);
}