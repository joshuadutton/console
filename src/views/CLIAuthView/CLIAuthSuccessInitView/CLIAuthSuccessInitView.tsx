import * as React from 'react'
import Left from './Left'
import Right from './Right'

interface Props {
  location: any
}

export default class CLIAuthSuccessInitView extends React.Component<Props, {}> {

  render() {
    const {query} = this.props.location
    const showAfterSignup = query.hasOwnProperty('afterSignup')

    return (
      <div className='example-project'>
        <style jsx>{`
          .example-project {
            @p: .w100, .h100, .flex, .fixed, .top0, .left0, .right0, .bottom0;
          }
        `}</style>
        <Left showAfterSignup={showAfterSignup}/>
        <Right />
      </div>
    )
  }
}
