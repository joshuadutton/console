import * as React from 'react'
import * as cn from 'classnames'
import {Icon, $v} from 'graphcool-styles'
import {connect} from 'react-redux'
import {showCurrentStep, skip} from '../../../actions/gettingStarted'
import {GettingStartedState} from '../../../types/gettingStarted'
import {withRouter} from 'react-router'

interface Props {
  gettingStartedState: GettingStartedState
  skip: () => void
  router: ReactRouter.InjectedRouter
  params: any
}

interface State {

}

class OnboardingBar extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    const progressPercentage = (100 * (this.props.gettingStartedState.progress.index - 1)) / 3
    const progress = this.props.gettingStartedState.progress

    return (
      <div className='onboarding-bar'>
        <style jsx>{`
          .onboarding-bar {
            @p: .bgDarkBlue, .flex, .flexColumn, .absolute, .bottom0, .z3;
            width: calc(100% - 290px);
            border-left: 6px solid $darkestBlue;
          }
          .progress-bar {
            @p: .flexFixed, .w100;
            background: $blue50;
            height: 3px;
          }
          .progress {
            @p: .bgBlue, .h100;
          }
          .steps {
            @p: .flexFixed, .w100, .pl25, .pr16, .flex, .justifyBetween;
            padding-top: 18px;
            padding-bottom: 18px;
          }
          h2 {
            @p: .fw6, .white, .f20;
          }
          .help {
            @p: .white, .f14, .o50, .flex, .itemsCenter, .nowrap;
            margin-right: 68px;
          }
          .help span {
            @p: .mr6;
          }
          .skip {
            @p: .mr38, .underline, .pointer;
          }
        `}</style>
        <div className='progress-bar'>
          <div className='progress' style={{width: `${progressPercentage}%`}} />
        </div>
        <div className='steps'>
          <div className='flex itemsCenter'>
            <h2>Get Started</h2>
            {steps.map(step => (
              <Step
                active={step.n === progress.index}
                done={step.n < progress.index}
                n={step.n}
                onClick={() => this.gotoStep(step.n)}
              >
                {step.text}
              </Step>
            ))}
          </div>
          <div className='help'>
            <div className='skip' onClick={this.skip}>Skip</div>
            <span>Need help?</span>
            <img src={require('assets/graphics/onboarding-arrow.svg')} alt=''/>
          </div>
        </div>
      </div>
    )
  }

  private skip = () => {
    graphcoolConfirm(
      'This skips the Onboarding. 73% of our users going through the onboarding built successful Graphcool projects.',
      'Skip Onboarding',
    )
      .then(() => {
        this.props.skip()
      })
  }

  private gotoStep(n: number) {
    const {router, params} = this.props
    switch (n) {
      case 1:
        return router.push(`/${params.projectName}/schema`)
      case 2:
        return router.push(`/${params.projectName}/playground`)
      case 3:
        return router.push(`/${params.projectName}/playground`)
    }
  }
}

const steps = [
  {
    n: 1,
    text: 'Define Schema',
  },
  {
    n: 2,
    text: 'Get Started with the API',
  },
  {
    n: 3,
    text: 'Run example',
  },
]

// const isActive = progress.index === data.index
// const isComplete = progress.index > data.index

interface StepProps {
  children?: any
  n: number
  done?: boolean
  active?: boolean
  onClick?: () => void
}

function Step({children, n, done, active, onClick}: StepProps) {
  return (
    <div className={cn('step', {done, active})} onClick={onClick}>
      <style jsx={true}>{`
        .step {
          @p: .flex, .itemsCenter, .ml38;
        }
        .circle {
          @p: .br100, .tc, .f14, .fw6, .white60, .inlineFlex, .justifyCenter, .itemsCenter;
          border: 2px solid $white30;
          width: 25px;
          height: 25px;
          line-height: 25px;
        }
        span {
          @p: .ml10, .f16, .white50
        }
        .step.done .circle {
          @p: .bgWhite30;
          border: none;
        }
        .step.active {
          @p: .blue, .pointer;
        }
        .step.active .circle {
          @p: .blue;
          border: 2px solid $blue50;
        }
        .step.active span {
          @p: .blue;
        }
      `}</style>
      <div className='circle'>
        {done ? (
          <Icon
            src={require('graphcool-styles/icons/fill/check.svg')}
            color={$v.white60}
            width={18}
            height={18}
          />
        ) : (
          n
        )}
      </div>
      <span>{children}</span>
    </div>
  )
}

export default connect(
  state => ({
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }),
  {
    showCurrentStep, skip,
  },
)(withRouter(OnboardingBar))
