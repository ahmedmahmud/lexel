import { writable } from "svelte/store";
import type { BaseNode } from "./fs";

export interface DndState {
  dragging: boolean;
  dragElement: HTMLElement | null;
  dropElement: HTMLElement | null;
  dragNode: BaseNode | null;
  dropNode: BaseNode | null;
  startPos: { x: number, y: number } | null;
  currentPos: { x: number, y: number } | null;
  clickAllowed: boolean;
}

export const dndStore = writable<DndState>({
  dragging: false,
  dragElement: null,
  dropElement: null,
  dragNode: null,
  dropNode: null,
  startPos: null,
  currentPos: null,
  clickAllowed: true,
});

export const treeStore = writable<BaseNode | null>(null);
export const expandedStore = writable<string[]>([]);