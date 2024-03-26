import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import { get, set } from './store'

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

type Result<T> = { ok: true; value: T } | { ok: false; error: Error }
function from_err(err: Error): Result<Root> {
  return { ok: false, error: err }
}
function from_value(value: Root): Result<Root> {
  return { ok: true, value }
}

export function start(): Root {
  const notes_dir = os.homedir() + '/documents/lexel'
  set('base', notes_dir)
  let root: Root = scanDirectory(notes_dir, '')
  return root
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

/* Handlers */
export async function handleMove(_event: Electron.Event, from: string, to: string, name: string) {
  const base = get('base')
  const from_abs = path.join(base, from)
  const to_abs = path.join(base, to, name)

  try {
    await fs.move(from_abs, to_abs)
    const new_root = scanDirectory(base, '', undefined)
    return from_value(new_root)
  } catch (err: any) {
    console.error('move failed', err)
    return from_err(err)
  }
}
