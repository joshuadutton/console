import {EventType} from '../views/FunctionsView/FunctionPopup/FunctionPopup'
import {ServerlessFunction} from '../types/types'
export function getEventTypeFromFunction(fn: ServerlessFunction | null): EventType {

  if (!fn) {
    return 'SSS'
  }

  switch (fn.__typename) {
    case 'CustomMutationFunction':
      return 'SCHEMA_EXTENSION'
    case 'CustomQueryFunction':
      return 'SCHEMA_EXTENSION'
    case 'SchemaExtensionFunction':
      return 'SCHEMA_EXTENSION'
    case 'ServerSideSubscriptionFunction':
      return 'SSS'
    case 'RequestPipelineMutationFunction':
      return 'RP'
  }

  throw new Error(`unkown function type ${fn.__typename}`)
}
