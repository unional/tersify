
export function trim(value: string, length: number) {
  let result = value
  switch (true) {
    case (length >= value.length):
      break;
    case (length <= 0):
      result = ''
      break
    case (length === 1):
      result = '.'
      break
    case (length === 2):
      result = value[0] + '.'
      break
    case (length === 3):
      result = value.slice(0, 2) + '.'
      break
    case (length === 4):
      result = value.slice(0, 2) + '..'
      break
    default:
      result = value.slice(0, length - 3) + '...'
      break
  }

  length -= result.length
  return result
}
