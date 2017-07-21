import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import {smoothScrollTo} from '../../../utils/smooth'
import {webhookUrlValid} from './functionPopupState'

interface Props {
  url: string
  onChangeUrl: (url: string) => void
  headers: {[key: string]: string}
  onChangeHeaders: (headers: {[key: string]: string}) => void
  showErrors: boolean
}

interface State {
  addingRow: boolean
  currentName: string
  currentValue: string
  editingRow: string
}

export default class WebhookEditor extends React.Component<Props, State> {

  private ref: any
  private nameInput: any

  constructor(props) {
    super(props)

    this.state = {
      addingRow: false,
      currentName: '',
      currentValue: '',
      editingRow: '',
    }
  }

  render() {
    const {url, onChangeUrl, headers, showErrors} = this.props
    const {addingRow} = this.state
    return (
      <div className='webhook-editor' ref={this.setRef}>
        <style jsx={true}>{`
          .webhook-editor {
            @p: .overflowAuto, .flexAuto, .flex, .flexColumn;
          }
          textarea {
            @p: .f14, .white, .mono, .ph25, .w100, .flexFixed;
            background: none;
            border: none;
            word-break: break-all;
            resize: none;
          }
          .headers {
            @p: .bgDarkestBlue, .pa25, .flexAuto, .overflowAuto;
          }
          .row {
            @p: .flex, .mb10, .pointer, .flex, .itemsCenter;
            height: 20px;
          }
          .rm {
            @p: .o0;
            transition: $duration opacity;
          }
          .row:hover .rm {
            @p: .white, .fw7, .pl6, .o100, .ml6, .f20;
          }
          .name {
            @p: .white, .fw6, .f14;
            min-width: 120px;
          }
          .value {
            @p: .white, .f14;
          }
          .add-row-inactive {
            @p: .f14, .white40, .mt12, .pointer;
          }
          .edit-row {
            @p: .flex, .overflowHidden, .br2;
          }
          .left, .right {
            @p: .pv10, .ph12;
          }
          .left {
            @p: .bgWhite;
          }
          .right {
            @p: .br2, .brRight;
            background: rgb(245, 245, 245);
          }
          input {
            @p: .f14;
            background: none;
          }
          .name-input {
            @p: .blue;
          }
          .value-input {
            @p: .black80;
          }
          .right {
            @p: .flex, .itemsCenter;
          }
          .error {
            @p: .pb16, .pl25, .red, .f14;
          }
        `}</style>
        <textarea
          autoFocus
          rows={2}
          onChange={this.urlChange}
          onKeyDown={this.keyDown}
          placeholder='Paste your webhook url here…'
          value={url}
        />
        {showErrors && (!webhookUrlValid(url)) && (
          <div className='error'>
            Please enter a valid Webhook url ⤴
          </div>
        )}
        <div className='headers'>
          {headers && Object.keys(headers).map(name => (
            this.state.editingRow === name ? (
              <HeaderRow
                name={this.state.currentName}
                value={this.state.currentValue}
                onChangeName={this.onChangeName}
                onChangeValue={this.onChangeValue}
                onSubmit={this.finishEditRow}
                nameRef={ref => this.nameInput = ref}
              />
            ) : (
              <div className='row' onClick={() => this.startEditRow(name)}>
                <div className='name'>{name}</div>
                <div className='value'>{headers[name]}</div>
                <div className='rm' onClick={() => this.removeRow(name)}>×</div>
              </div>
            )
          ))}
          {!addingRow ? (
            <div className='add-row-inactive' onClick={this.toggleAddRow}>+ add HTTP Header</div>
          ) : (
            <HeaderRow
              name={this.state.currentName}
              value={this.state.currentValue}
              onChangeName={this.onChangeName}
              onChangeValue={this.onChangeValue}
              onSubmit={this.addRow}
              nameRef={ref => this.nameInput = ref}
            />
          )}
        </div>
      </div>
    )
  }

  private toggleAddRow = e => {
    this.setState(state => {
      return {
        ...state,
        editingRow: '',
        currentName: '',
        currentValue: '',
        addingRow: !state.addingRow,
      }
    })
  }

  private startEditRow = (name: string) => {
    const value = this.props.headers[name]
    this.setState({
      editingRow: name,
      currentName: name,
      currentValue: value,
      addingRow: false,
    } as State)
  }

  private finishEditRow = () => {
    const {headers} = this.props
    const oldName = this.state.editingRow

    let newHeaders = {}

    Object.keys(headers).forEach(name => {
      if (name === oldName) {
        newHeaders[this.state.currentName] = this.state.currentValue
      } else {
        newHeaders[name] = headers[name]
      }
    })

    this.props.onChangeHeaders(newHeaders)
    this.setState({
      currentName: '',
      currentValue: '',
      editingRow: '',
    } as State)
  }

  private setRef = ref => {
    this.ref = ref
  }

  private scrollDown = () => {
    if (this.ref) {
      const target = this.ref.scrollHeight - this.ref.clientHeight
      smoothScrollTo(this.ref, target, 50)
    }
  }

  private removeRow = (name: string) => {
    const copy = Object.assign({}, this.props.headers)
    delete copy[name]
    this.props.onChangeHeaders(copy)
  }

  private addRow = () => {
    const {currentName, currentValue} = this.state
    this.props.onChangeHeaders({
      ...this.props.headers,
      [currentName]: currentValue,
    })
    this.setState(
      {
        currentName: '',
        currentValue: '',
      } as State,
      () => {
        this.nameInput.focus()
      },
    )
  }

  private onChangeName = e => {
    this.setState({currentName: e.target.value} as State)
  }

  private onChangeValue = e => {
    this.setState({currentValue: e.target.value} as State)
  }

  private urlChange = e => {
    this.props.onChangeUrl(e.target.value)
  }

  private valueKeyDown = e => {
    if (e.keyCode === 13) {
      this.addRow()
    }
  }

  private keyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

interface HeaderRowProps {
  name: string
  value: string
  onChangeName: (e: any) => void
  onChangeValue: (e: any) => void
  onSubmit: () => void
  nameRef?: (ref: any) => void
}

class HeaderRow extends React.Component<HeaderRowProps, null> {
  render () {
    const {name, value, onChangeName, onChangeValue, onSubmit, nameRef} = this.props
    return (
      <div className='edit-row'>
        <style jsx>{`
          .name {
            @p: .white, .fw6, .f14;
            min-width: 120px;
          }
          .value {
            @p: .white, .f14;
          }
          .ok {
            @p: .bgLightgreen20, .br100, .flex, .itemsCenter, .justifyCenter, .mh16, .pointer, .flexFixed;
            width: 25px;
            height: 25px;
          }
          .edit-row {
            @p: .flex, .overflowHidden, .br2, .mb10, .mt6;
          }
          .left, .right {
            @p: .pv10, .ph12;
          }
          .left {
            @p: .bgWhite;
          }
          .right {
            @p: .br2, .brRight, .flex, .itemsCenter, .justifyBetween;
            background: rgb(245, 245, 245);
          }
          input {
            @p: .f14;
            background: none;
          }
          .name-input {
            @p: .blue;
            max-width: 125px;
          }
          .value-input {
            @p: .black80, .flexAuto;
            max-width: 125px;
          }
        `}</style>
        <div className='left'>
          <input
            type='text'
            className='name-input'
            placeholder='Type a name ...'
            autoFocus
            value={name}
            onChange={onChangeName}
            ref={nameRef}
          />
        </div>
        <div className='right'>
          <input
            type='text'
            className='value-input'
            placeholder='Type the content ...'
            value={value}
            onChange={onChangeValue}
            onKeyDown={this.handleKeyDown}
          />
          <div className='ok' onClick={onSubmit}>
            <Icon src={require('graphcool-styles/icons/fill/check.svg')} color={$v.green} />
          </div>
        </div>
      </div>
    )
  }

  private handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.props.onSubmit()
    }
  }
}
