import * as React from 'react'
import {FunctionBinding, FunctionType, Model, RequestPipelineMutationOperation} from '../../../types/types'
import FunctionInput from './FunctionInput'
import StepMarker from './StepMarker'
import {getText} from './data'
import {EventType} from './FunctionPopup'
import N from './N'
import { Button } from '../../../components/Links'
import { examples } from './examples'

interface Props {
  name: string
  inlineCode: string
  onInlineCodeChange: (code: string) => void
  onNameChange: (name: string) => void
  binding: FunctionBinding
  isInline: boolean
  onTypeChange: (type: FunctionType) => void
  onChangeUrl: (url: string) => void
  webhookUrl: string
  schema: string
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  editing: boolean
  query: string
  onChangeQuery: (query: string) => void
  eventType: EventType
  projectId: string
  sssModelName: string
  modelName?: string
  operation?: RequestPipelineMutationOperation
  showErrors: boolean
  updateFunction: () => Promise<any>
  location: any
  params: any
}

interface State {

}

export default class FunctionEditor extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const {
      name, inlineCode, onInlineCodeChange, onNameChange, binding, isInline, onTypeChange,
      webhookUrl, onChangeUrl, schema, editing, eventType, onChangeQuery, query,
      showErrors, location,
    } = this.props
    return (
      <div className='request-pipeline-function'>
        <style jsx>{`
          .request-pipeline-function {
          }
          input {
            @p: .hf32, .blue, .pl38, .w100;
            line-height: 1.4;
          }
          .line {
            @p: .bgDarkBlue10, .ph16, .w100, .mv25;
            height: 2px;
          }
          p {
            @p: .f16, .darkBlue50, .pl38, .pr60, .pb25;
          }
          .pre {
            @p: .mono, .bgDarkBlue07, .br2, .ml4;
            padding: 1px 3px;
          }
          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .mh6, .dib, .f14;
            padding: 2px 4px;
          }
          .error {
            @p: .red, .pv16, .f16, .ml38;
          }
          .content {
            @p: .overflowAuto;
          }
          .examples {
            @p: .pl38, .pb25;
          }
          h3 {
            @p: .darkBlue50, .mb25, .f25, .fw6;
          }
          .examples :global(.button) {
            @p: .mr25;
          }
        `}</style>
        <input
          type='text'
          value={name}
          onChange={this.nameChange}
          placeholder='Set a function name...'
          autoFocus
          data-test='function-name-input'
        />
        {showErrors && (!name || name.length === 0) && (
          <div className='error'>Please give your function a name ⤴</div>
        )}
        {!editing && (
          <StepMarker active style={{marginTop: -36, marginLeft: 0}}>1</StepMarker>
        )}
        <div className='line' />
        <div className='content'>
          {eventType === 'RP' && (editing ? (
            <p>Request-Pipeline Step: <span className='pre'>{binding}</span></p>
          ) : (
            <p>
              By creating a function at
              <span className='pre'>{binding}</span>
              {getText(binding)}&nbsp;
              Your function will be called when a
              <span className='pre'>{this.props.modelName}</span> is
              <span className='pre'>{this.props.operation.toLowerCase()}d</span>
            </p>
          ))}
          {eventType === 'SSS' && !editing && (
            <p>
              To create a server-side subscription, you need to
              <N>1</N>
              define a function name
              <N>2</N>
              define a trigger with some input (usually one or more mutations for one type), as well as
              <N>3</N>
              write a function that get’s executed every time.
            </p>
          )}
          {'SCHEMA_EXTENSION' === eventType && !editing && (
            <p>
              To create a schema extension, you need to
              <N>1</N>
              define a function name
              <N>2</N>
              define the schema sdl that describes the GraphQL API
              <N>3</N>
              write a function that get’s executed every time.
            </p>
          )}
          {(eventType === 'RP' || eventType === 'SSS') && (
            <p className='relative'>
              The <pre>event</pre> argument represents the payload of the
              {eventType === 'RP' ? ' mutation' : ' subscription'}. <br/>
              {eventType === 'RP' && (
                <span>
                  You can either <pre>return</pre> a value or a <pre>Promise</pre> if you have an async flow.
                </span>
              )}
            </p>
          )}
          {eventType === 'SCHEMA_EXTENSION' && (
            <div className='examples'>
              <h3>Examples</h3>
              <Button white hideArrow onClick={this.selectExample.bind(this, 'weather')}>Weather API</Button>
              <Button white hideArrow onClick={this.selectExample.bind(this, 'cuid')}>CUID Generator</Button>
              <Button
                white
                hideArrow
                onClick={this.selectExample.bind(this, 'sendgrid')}
              >Send Mail with Sendgrid</Button>
            </div>
          )}
        </div>
        <FunctionInput
          schema={schema}
          onChange={onInlineCodeChange}
          value={inlineCode}
          isInline={isInline}
          onTypeChange={onTypeChange}
          webhookUrl={webhookUrl}
          onChangeUrl={onChangeUrl}
          headers={this.props.headers}
          onChangeHeaders={this.props.onChangeHeaders}
          editing={this.props.editing}
          eventType={eventType}
          onChangeQuery={this.props.onChangeQuery}
          query={this.props.query}
          projectId={this.props.projectId}
          sssModelName={this.props.sssModelName}
          showErrors={this.props.showErrors}
          updateFunction={this.props.updateFunction}
          location={this.props.location}
          params={this.props.params}
        />
      </div>
    )
  }

  private selectExample = (exampleName: string) => {
    const example = examples[exampleName]
    this.props.onChangeQuery(example.sdl)
    this.props.onInlineCodeChange(example.code)
  }

  private nameChange = e => {
    this.props.onNameChange(e.target.value)
  }
}
