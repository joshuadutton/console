import * as React from 'react'
const classes: any = require('./CheckboxCell.scss')
import {classnames} from '../../../utils/classnames'

interface Props {
  onChange: (checked: boolean) => void
  checked: boolean
  height: number
  disabled?: boolean
  [key: string]: any
}

export default class CheckboxCell extends React.Component<Props, {}> {

  _toggle () {
    this.props.onChange(!this.props.checked)
  }

  render () {
    const {height, checked, onChange, ...rest} = this.props
    return (
      <div
        className={classes.root}
        style={{
          height,
        }}
        onClick={() => this._toggle()}
        {...rest}
      >
        <div
          className={classes.border}
        >

          <div
            className={
              classnames(classes.dot, {
                [classes.active]: checked,
              })
            }
          >

          </div>
        </div>
      </div>
    )
  }
}
/*backgroundColor: this.props.checked ? '#EEF9FF' : this.props.backgroundColor,*/
