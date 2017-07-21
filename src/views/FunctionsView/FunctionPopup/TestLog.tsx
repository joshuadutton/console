import * as React from 'react'
import {TestResponse} from './TestPopup'
const ResultViewer: any = require('../FunctionLogs/ResultViewer').ResultViewer
import {Icon, $v} from 'graphcool-styles'
import * as moment from 'moment'
import * as cn from 'classnames'

interface Props {
  response: TestResponse
}

function extractDataFromResponse(response: TestResponse) {
  /* Inline */
  let event = null
  let returnValue = null

  /* Webhook */
  let requestHeaders = null
  let requestBody = null
  let responseStatusCode = null
  let responseBody = null

  /* Both */
  let logs = null
  let error = null

  if (response.inline) {
    const {inline} = response
    event = inline.event
    if (inline.returnValue) {
      returnValue = JSON.stringify(inline.returnValue, null, 2)
    }
    logs = inline.logs
    error = inline.errors
  }

  if (response.webhook) {
    const {webhook} = response
    requestHeaders = JSON.stringify(webhook.request.headers, null, 2)
    requestBody = webhook.request.body
    responseStatusCode = webhook.response.statusCode
    responseBody = webhook.response.body
  }

  return {
    event,
    returnValue,
    requestHeaders,
    requestBody,
    responseStatusCode,
    responseBody,
    logs,
    error,
  }
}

export default function TestLog({response}: Props) {
  const date = new Date(response.timestamp)
  const ago = moment(date).fromNow()
  const isError = response.isError
  const {
    event,
    returnValue,
    requestHeaders,
    requestBody,
    responseStatusCode,
    responseBody,
    logs,
    error,
  } = extractDataFromResponse(response)

  const wrapLogs = window.innerWidth < 1300

  return (
    <div className={cn('test-log', {error: isError})}>
      <style jsx={true}>{`
        .test-log {
          @p: .w100, .overflowAuto, .mb25;
          min-width: 200px;
          max-width: calc(100vw - 700px);
        }
        .test-log.error .line {
          @p: .bgRed, .o30;
        }
        .header {
          @p: .flex, .itemsCenter;
        }
        .line {
          @p: .flexAuto, .bgGreen30, .mh10;
          height: 2px;
        }
        .header-sides {
          @p: .flexFixed, .green, .f12;
        }
        .test-log.error .header-sides {
          @p: .red;
        }
        .graphiql-container :global(div.CodeMirror) {
          background: transparent;
        }
        .graphiql-container :global(div.CodeMirror-lines) {
          @p: .pa0;
        }
        .meta {
          @p: .mv10;
        }
        .meta-entry {
          @p: .flex, .itemsCenter, .mb6;
        }
        .label {
          @p: .ttu, .white40, .f12, .fw6;
          letter-spacing: 0.6px;
          min-width: 72px;
        }
        .error-response .label {
          @p: .red, .o40;
        }
        .meta-entry .value {
          @p: .ml10;
        }
        .value {
          @p: .mono, .white80;
          letter-spacing: 0.6px;
        }
        .value, .test-log :global(.CodeMirror) {
          font-size: 13px;
        }
        .error-response .value {
          @p: .red, .o80;
        }
        .entry {
          @p: .mt10;
        }
        .entry .label {
          @p: .mb4;
        }
        .error {
          @p: .red;
        }
        h2 {
          @p: .mb10, .mt16;
        }
      `}</style>
      <div className='header'>
        <div className='header-sides'>
          {error ? (
            <Icon src={require('graphcool-styles/icons/stroke/cross.svg')} color={$v.red} stroke strokeWidth={4} />
          ) : (
            <Icon src={require('graphcool-styles/icons/fill/check.svg')} color={$v.green} />
          )}
        </div>
        <div className='line' />
        <div className='header-sides'>{ago}</div>
      </div>
      <div className='meta'>
        {['timestamp', 'duration'].map(key => (
          <div className='meta-entry'>
            <div className='label'>{key}</div>
            <div className='value'>{response[key]}</div>
          </div>
        ))}
      </div>
      {event && (
        <div className='entry'>
          <div className='label'>Event</div>
          <div className='graphiql-container'>
            <ResultViewer
              value={event}
            />
          </div>
        </div>
      )}
      {returnValue && (
        <div className='entry'>
          <div className='label'>Return Value</div>
          <div className='graphiql-container'>
            <ResultViewer
              value={returnValue}
            />
          </div>
        </div>
      )}
      {requestHeaders && (
        <div className='entry'>
          <div className='label'>Request Headers</div>
          <div className='graphiql-container'>
            <ResultViewer
              value={requestHeaders}
            />
          </div>
        </div>
      )}
      {requestBody && (
        <div className='entry'>
          <div className='label'>Request Body</div>
          <div className='graphiql-container'>
            <ResultViewer
              value={requestBody}
            />
          </div>
        </div>
      )}
      {responseStatusCode && (
        <div className='meta-entry'>
          <div className='label'>Response Status Code</div>
          <div className='value'>{responseStatusCode}</div>
        </div>
      )}
      {responseBody && (
        <div className='entry'>
          <div className='label'>Response Body</div>
          <div className='graphiql-container'>
            <ResultViewer
              value={responseBody}
            />
          </div>
        </div>
      )}
      {logs && logs.length > 0 && (
        <div className='entry'>
          <div className='label'>Logs</div>
          {logs.map(log => (
            <div className={cn('value flex itemsStart', {flexColumn: wrapLogs})} key={log}>
              <b className='dib nowrap flexFixed'>{log.slice(0, 25)}</b>
              <span className={cn('flexAuto', {'ml10': !wrapLogs})}>{log.slice(25, log.length)}</span>
            </div>
          ))}
        </div>
      )}
      {error && (typeof error === 'string' ? (
        <div className='error-response'>
          <h2 className='mono'>Error</h2>
          <div className='meta-entry'>
            <div className='label'>message</div>
            <div className='value'>{error}</div>
          </div>
        </div>
      ) : (
        <div className='error-response'>
          <h2 className='mono'>Error</h2>
          <div className='meta-entry'>
            <div className='label'>code</div>
            <div className='value'>{error.code}</div>
          </div>
          <div className='meta-entry'>
            <div className='label'>message</div>
            <div className='value'>{error.message}</div>
          </div>
          <div className='meta-entry'>
            <div className='label'>error</div>
            <div className='value'>{error.error}</div>
          </div>
          <div className='mt10 mono'>
            {error.stack.split('\n').map(line => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
