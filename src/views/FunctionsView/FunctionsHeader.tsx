import * as React from 'react'
import {Icon, $v} from 'graphcool-styles'
import ModalDocs from '../../components/ModalDocs/ModalDocs'
import {Link} from 'react-router'
import DocsPopup from '../../components/DocsPopup'

interface Props {
  params: any
}

export default function FunctionsHeader({params}: Props) {
  return (
    <div className='functions-header'>
      <style jsx={true}>{`
        .functions-header {
          @p: .bgBlack04, .pa16, .flex, .justifyBetween, .w100;
        }
        .btn {
          @p: .bgGreen, .buttonShadow, .br2, .white, .ttu, .fw6, .f14, .ml25, .pointer, .flex, .itemsCenter;
          padding: 7px 11px;
          transition: $duration all;
        }
        .btn:hover {
          @p: .o60;
        }
        .btn span {
          @p: .ml10;
        }
        .f {
          @p: .tc, .ttl;
          font-family: cursive;
          line-height: 1;
          width: 28px;
        }
        .title {
          @p: .darkerBlue, .o50, .f20;
        }
        .title span {
          @p: .ml10;
        }
        .docs {
          @p: .z2;
        }
      `}</style>
      <div className='flex itemsCenter'>
        <div className='title flex itemsCenter'>
          <Icon
            src={require('graphcool-styles/icons/fill/actions.svg')}
            color={$v.darkerBlue}
            width={29}
            height={29}
          />
          <span>Functions</span>
        </div>
        <Link to={`/${params.projectName}/functions/create`} data-test='create-function-button'>
          <div className='btn'>
            <Icon
              src={require('graphcool-styles/icons/stroke/addFull.svg')}
              stroke
              strokeWidth={6}
              color={$v.white50}
            />
            <span>New Function</span>
          </div>
        </Link>
      </div>
      <div className='docs'>
        <DocsPopup
          offsetX={16}
          offsetY={16}
          resources={[
            {
              title: 'Overview over Functions',
              type: 'guide',
              link: 'https://www.graph.cool/docs/reference/functions/overview-boo6uteemo/',
            },
          ]}
          videoId='l-0jGOxXKGY'
        />
      </div>
    </div>
  )
}
