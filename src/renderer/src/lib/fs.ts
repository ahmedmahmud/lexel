export type BaseNode = DirNode | FileNode

export type DirNode = {
  type: 'folder'
  name: string
  path: string
  relative_path: string
  leaf_count: number
  parent?: DirNode
  children: BaseNode[]
}

export type FileNode = {
  type: 'file'
  name: string
  path: string
  relative_path: string
  leaf_count: number
  parent: DirNode
  extension: string
}

const shownExtensions = new Set([
  '.md',
  '.png'
])

export function isDescendant(child: BaseNode, ancestor: BaseNode) {
  if (ancestor.type === 'file') return false
  let parent = child
  while (parent) {
    if (parent === ancestor) {
      return true
    }
    parent = parent.parent
  }
  return false
}

export function isShown(node: BaseNode) {
  if (node.type === 'folder') return true
  return shownExtensions.has(node.extension)
}
