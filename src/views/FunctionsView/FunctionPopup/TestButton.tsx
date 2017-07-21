import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import * as cn from 'classnames'

interface Props {
  onClick?: (e: any) => void
  className?: string
  children?: any
}

export default function TestButton({onClick, className, children}: Props) {
  return (
    <div className={cn('btn', className)} onClick={onClick}>
      <style jsx>{`
        .btn {
          @p: .bgWhite, .darkBlue70, .f16, .ph16, .br2, .inlineFlex, .itemsCenter, .buttonShadow, .pointer;
          padding-top: 9px;
          padding-bottom: 10px;
        }
        .btn span {
          @p: .ml10;
        }
      `}</style>
      <Icon
        src={require('graphcool-styles/icons/fill/triangle.svg')}
        color={$v.darkBlue40}
        width={10}
        height={10}
      />
      <span>
        {children || 'Test Run'}
      </span>
    </div>
  )
}
