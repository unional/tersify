import { TersifyOptions } from '../interfaces';

export type TersifyContext = TersifyOptions & { noTrim: boolean, references: any[] }
