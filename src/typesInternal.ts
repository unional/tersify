import { TersifyOptions } from './types';

export type TersifyContext = TersifyOptions & { path: (keyof any)[], noTrim: boolean, references: { value: any, path: (keyof any)[] }[] }
