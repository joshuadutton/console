import { Enum, Field } from '../../../../types/types'
import {TypedValue} from '../../../../types/utils'

export interface CellProps<T> {
  value: T,
  save?: (value: TypedValue) => void,
  cancel?: () => void,
  onKeyDown?: (event: any) => void,
  field?: Field,
  inList?: boolean
  enums?: Enum[]
}

export interface CellState {
  valueString: string,
  valid?: boolean,
}
