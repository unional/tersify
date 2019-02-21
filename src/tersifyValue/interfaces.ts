import { TersifyOptions } from '../interfaces';

export type TersifyContext = TersifyOptions & { path: string[], noTrim: boolean, references: { value: any, path: string[] }[] }
