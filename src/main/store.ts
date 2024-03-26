let store = {}

export function set(key, value) {
  store[key] = value
}

export function get(key) {
  return store[key]
}
