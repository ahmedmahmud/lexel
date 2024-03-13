import fs from 'fs'
import os from 'os'
import path from 'path'

type FSNode = Branch | Leaf

type Leaf = {
  name: string
  path: string
  relative_path: string
  extension: string
  leaf_count: number
  type: 'file'
  parent: Branch
}

type Branch = {
  name: string
  path: string
  relative_path: string
  children: FSNode[]
  leaf_count: number
  type: 'folder'
  parent?: Branch
}

type Root = Branch

type Result<T> = { ok: true; value: T } | { ok: false; error: number }
function from_err(err: error_codes): Result<Root> {
  return { ok: false, error: err }
}
function from_value(value: Root): Result<Root> {
  return { ok: true, value }
}

export function start() {
  const notes_dir = os.homedir() + '/documents/lexel'
  let root: Root = scanDirectory(notes_dir, '')
}

function scanDirectory(full_path: string, relative_path: string, parent?: Branch): Branch {
  const new_parent = create_directory_node(full_path, relative_path, parent)

  const children: FSNode[] = []
  const items = read_directory(full_path)

  for (const item of items) {
    const child_full_path = path.join(full_path, item)
    const child_relative_path = path.join(relative_path, item)
    if (isDirectory(child_full_path)) {
      const child_node = scanDirectory(child_full_path, child_relative_path, new_parent)
      children.push(child_node)
    } else {
      const child_node = create_leaf(child_full_path, child_relative_path, new_parent)
      children.push(child_node)
    }
  }

  return inject_children(new_parent, children)
}

function isDirectory(path: string): boolean {
  const stats = fs.statSync(path)
  return stats.isDirectory()
}

/**
 * Implementation to read the contents of the directory at the given path
 * and return an array of strings representing the items in the directory.
 * @param {string} path
 *
 * @returns {string[]} Array of strings representing the items in the directory
 *
 * @example
 * readDirectoryContents('path/to/directory')
 * // => ['file1', 'file2', 'file3']
 */
function read_directory(path: string): string[] {
  const items = fs.readdirSync(path)
  return items
}

function create_leaf(full_path: string, relative_path: string, parent: Branch): Leaf {
  const name = path.basename(full_path)
  const extension = path.extname(full_path)
  return {
    name,
    path: full_path,
    relative_path,
    extension,
    type: 'file',
    leaf_count: extension === '.md' ? 1 : 0,
    parent
  }
}

function create_directory_node(
  path_string: string,
  relative_path: string,
  parent?: Branch
): Branch {
  const name = path.basename(path_string)

  return {
    name,
    path: path_string,
    relative_path,
    children: [],
    leaf_count: 0,
    type: 'folder',
    parent
  }
}

function inject_children(node: Branch, children: FSNode[]): Branch {
  const leaf_count = children.reduce((a, c) => {
    return a + c.leaf_count
  }, 0)
  node.children = children
  node.leaf_count = leaf_count
  return node
}

/**
 * Find a node in the tree given a path by walking through its path segments
 * @param root
 * @param path
 * @returns
 */

function find_node(current: FSNode, relative_path: string): FSNode | undefined {
  // Reached the end of the path
  if (relative_path === '' || relative_path === '.') {
    return current
  }

  // If the current node is a file, we can't go any further
  if (current.type === 'file') {
    return undefined
  }

  const segments = relative_path.split('/')
  const next_segment = segments[0]
  const remaining_path = path.join(...segments.slice(1))
  const next = current.children.find((child) => child.name === next_segment)
  if (next) {
    return find_node(next, remaining_path)
  }
  return undefined
}

function create_file(root: Root, to_path: string, name: string): Result<Root> {
  const parent = find_node(root, to_path)

  if (!parent) {
    return from_err(error_codes.TO_NOT_FOUND)
  }

  if (parent.type !== 'folder') {
    return from_err(error_codes.TO_NOT_FOLDER)
  }

  const full_path = path.join(parent.path, name)
  const relative_path = path.join(parent.relative_path, name)
  if (fs.existsSync(full_path)) {
    return from_err(error_codes.ALREADY_EXISTS)
  }

  fs.writeFileSync(full_path, '')
  const leaf = create_leaf(full_path, relative_path, parent)
  parent.children.push(leaf)
  parent.leaf_count += leaf.leaf_count

  return from_value(root)
}

function rename_node(root: Root, old_path: string, new_path: string, base: string): Result<Root> {
  if (old_path === '.' || old_path === '' || new_path === '.' || new_path === '') {
    return from_err(error_codes.MOVE_ROOT)
  }

  const node = find_node(root, old_path)
  if (!node) {
    return from_err(error_codes.FROM_NOT_FOUND)
  }

  const new_path_full = path.join(base, new_path)
  const parent_path_full = path.dirname(new_path_full)

  if (old_path === new_path) {
    return from_value(root)
  }

  if (fs.existsSync(new_path_full)) {
    return from_err(error_codes.ALREADY_EXISTS)
  }

  fs.mkdirSync(parent_path_full, { recursive: true })
  fs.renameSync(node.path, new_path_full)

  const new_root = scanDirectory(base, '', undefined)

  return from_value(new_root)
}

function create_folder(root: Root, to_path: string, name: string): Result<Root> {
  const parent = find_node(root, to_path)

  if (!parent) {
    return from_err(error_codes.TO_NOT_FOUND)
  }

  if (parent.type !== 'folder') {
    return from_err(error_codes.TO_NOT_FOLDER)
  }

  const full_path = path.join(parent.path, name)
  const relative_path = path.join(parent.relative_path, name)
  if (fs.existsSync(full_path)) {
    return from_err(error_codes.ALREADY_EXISTS)
  }

  fs.mkdirSync(full_path)
  const folder = create_directory_node(full_path, relative_path, parent)
  parent.children.push(folder)

  return from_value(root)
}

enum error_codes {
  NONE,
  FROM_NOT_FOUND,
  TO_NOT_FOUND,
  TO_NOT_FOLDER,
  ALREADY_EXISTS,
  MOVE_ROOT
}
