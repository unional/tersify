import { tersify } from './tersify'

export function tersifyArray(entries: Array<any>, option) {
  const tersedEntries = entries.map(entry => tersify(entry, option))
  return `[${tersedEntries.join(', ')}]`
}
