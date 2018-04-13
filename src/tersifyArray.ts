import { tersifyAny } from './tersifyAny'

export function tersifyArray(entries: Array<any>, option) {
  let length = 1
  const tersifiedEntries: string[] = []
  entries.forEach(entry => {
    if (length > option.maxLength) return

    const tersifiedEntry = tersifyAny(entry, option)
    length += tersifiedEntry.length
    tersifiedEntries.push(tersifiedEntry)
  })
  const tersified = `[${tersifiedEntries.join(', ')}]`
  if (tersified.length > option.maxLength) {
    return tersified.slice(0, option.maxLength - 5) + '... ]'
  }
  return tersified
}
