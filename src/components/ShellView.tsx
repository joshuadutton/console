import * as React from 'react'
const Codemirror: any = require('../views/FunctionsView/FunctionLogs/Codemirror').default

interface Props {
  value: string
}

export default function ShellView({value}: Props) {
  return (
    <div>
      <Codemirror
        value={value}
        options={{
          height: 'auto',
          mode: 'shell',
          viewportMargin: Infinity,
          theme: 'mdn-like',
          readOnly: true,
        }}
        onFocusChange={(focused) => {
          if (focused) {
            // TODO track
          }
        }}
      />
    </div>
  )
}
