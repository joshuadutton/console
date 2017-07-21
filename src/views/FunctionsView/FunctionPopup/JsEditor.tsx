import * as React from 'react'
import {EditorConfiguration} from 'codemirror'
const Codemirror: any = require('../FunctionLogs/Codemirror').default

interface Props {
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: any) => void
  onFocusChange?: (focused: boolean) => void
  onRun?: () => void
}

require('codemirror/theme/base16-dark.css')

export default function JsEditor({value, onChange, onKeyDown, onFocusChange, onRun}: Props) {
  return (
    <div className='js-editor'>
      <style jsx={true}>{`
        .js-editor {
          @p: .flex, .flexAuto, .overflowAuto;
        }
        .js-editor :global(.CodeMirror) {
          height: 100%;
        }
        .js-editor :global(.CodeMirror), .js-editor :global(.CodeMirror-gutters) {
          background: transparent;
        }
      `}</style>
      <Codemirror
        options={{
          mode: 'javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          keyMap: 'sublime',
          extraKeys: {
            'Cmd-Enter': () => {
              if (onRun) {
                onRun()
              }
            },
            'Ctrl-Enter': () => {
              if (onRun) {
                onRun()
              }
            },

            // Editor improvements
            'Ctrl-Left': 'goSubwordLeft',
            'Ctrl-Right': 'goSubwordRight',
            'Alt-Left': 'goGroupLeft',
            'Alt-Right': 'goGroupRight',
          },
        } as EditorConfiguration}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocusChange={onFocusChange}
      />
    </div>
  )
}
