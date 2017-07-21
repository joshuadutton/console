import * as React from 'react'
import * as FileSaver from 'file-saver'
import Info from '../../components/Info'
import {Button} from '../../components/Links'
import getFullIdl from '../../utils/schema'

interface Props {
  schema: string
  projectName: string
  projectId: string
}

interface State {
  open: boolean
}

export default class SchemaExport extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div>
        <style jsx={true}>{`
          .close {
            @p: .fixed, .top0, .left0, .right0, .bottom0, .z3;
          }
        `}</style>
        {this.state.open && (
          <div className='close' onClick={this.toggle}></div>
        )}
        <Info
          customTip={React.cloneElement(this.props.children as any, {onClick: this.toggle})}
          isOpen={this.state.open}
          top
          offsetX={40}
          width={346}
        >
          <div className='mb10'>
            Choose the schema to export...
          </div>
          <div className='flex justifyBetween'>
            <Button
              hideArrow
              onClick={this.downloadFull}
              title={`This is the full schema definition that you need for your Relay application.`}
            >
              Full Relay IDL
            </Button>
            <Button
              hideArrow
              onClick={this.downloadSimplified}
              title={`This is the simplified IDL, that you see in the Schema Editor.`}
            >
              Simplified IDL
            </Button>
          </div>
        </Info>
      </div>
    )
  }

  private toggle = () => {
    this.setState(state => {
      return {
        open: !state.open,
      }
    })
  }

  private downloadFull = () => {
    getFullIdl(this.props.projectId)
      .then((idl) => {
        const blob = new Blob([idl], {type: 'text/plain;charset=utf-8'})
        FileSaver.saveAs(blob, `${this.props.projectName}-relay.schema`)
      })
  }

  private downloadSimplified = () => {
    const blob = new Blob([this.props.schema], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, `${this.props.projectName}-simplified.schema`)
  }
}
