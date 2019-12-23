import { IsoError } from 'iso-error'
import { AcornNode } from './AcornTypes'

// istanbul ignore next
export class FailedToParse extends IsoError {
  constructor(public nodeType: string, public node: AcornNode) {
    super(`${nodeType}: ${JSON.stringify(node, undefined, 2)}`)
  }
}
