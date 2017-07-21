import * as Relay from 'react-relay/classic'
import {FunctionBinding, FunctionType} from '../../types/types'
import {pick} from 'lodash'

interface Props {
  id: string
  projectId: string
  name: string
  type?: FunctionType
  webhookUrl: string
  headers?: string
  inlineCode?: string
  auth0Id?: string
  isActive: boolean
  functionId?: string
  schema?: string
}

export default class UpdateSchemaExtensionFunction extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{updateSchemaExtensionFunction}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateSchemaExtensionFunctionPayload {
        function
        project
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        function: this.props.id,
      },
    }]
  }

  getVariables () {
    return pick(this.props, [
      'name', 'isActive', 'schema',
      'type', 'webhookUrl', 'webhookHeaders', 'inlineCode', 'auth0Id', 'functionId',
    ])
  }
}
