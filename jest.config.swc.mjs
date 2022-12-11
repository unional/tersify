import { knownTransforms } from '@repobuddy/jest'

/** @type {import('jest').Config} */
export default {
  preset: '@repobuddy/jest/presets/ts-esm-watch',
  transform: knownTransforms.swc()
}
