import * as React from 'react'
import {Step} from '../../../types/gettingStarted'
import ExampleChooser, {Example} from './ExampleChooser'
import WaitingIndicator from './WaitingIndicator'
import {Button} from '../../../components/Links'
import {connect} from 'react-redux'
import {nextStep} from '../../../actions/gettingStarted'
import {pre} from 'graphcool-styles/dist/particles.css'

interface Props {
  step: Step
  projectId: string
  nextStep: (by?: number) => void
}

interface State {
  selectedExampleIndex: number
}

class SelectExample extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      selectedExampleIndex: 0,
    }
  }
  getDownloadUrl(example: Example) {
    /* tslint:disable-line */
    return `${__EXAMPLE_ADDR__}/?repository=${example.path}&project_id=${this.props.projectId}&user=graphcool-examples&subfolder=${example.subfolder}`
  }
  render() {
    const selectedExample = examples[this.state.selectedExampleIndex]
    const downloadUrl = this.getDownloadUrl(selectedExample)

    return (
      <div className='select-example'>
        <style jsx={true}>{`
          .select-example {
            @p: .w100;
          }
          .intro {
            @p: .pa38;
          }
          h1 {
            @p: .tc, .fw6, .hf32, .darkBlue, .mb25;
          }
          h2 {
            @p: .blue, .tc, .fw6, .f20;
          }
          p {
            @p: .f16, .darkBlue70;
          }
          .intro p {
            @p: .tc;
          }
          .middle {
            @p: .pa38;
            border-top: 2px solid $darkBlue07;
            border-bottom: 2px solid $darkBlue07;
          }
          .last {
            @p: .bgDarkBlue04, .pa38;
          }
          .cta {
            @p: .flex, .justifyBetween, .itemsCenter;
          }
          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .mh6, .dib, .f14;
            padding: 2px 4px;
          }
          .cta p {
            max-width: 410px;
          }
          .waiting {
            @p: .flex, .itemsCenter, .blue;
          }
          .waiting span {
            @p: .ml16;
          }
          .skip {
            @p: .pointer, .underline, .darkBlue40, .dib, .f16;
          }
          .bottom {
            @p: .flex, .justifyBetween, .itemsCenter, .mt60, .w100;
          }
        `}</style>
        <div className='intro'>
          <h1>Time to run an example...</h1>
          <p>
            You've successfully set up your GraphQL backend. It's now time to test it. <br/>
            We've already prepared an Instagram example project for you.
          </p>
        </div>
        <div className='middle'>
          <h2>Select your preferred technology:</h2>
          <ExampleChooser
            examples={examples}
            activeIndex={this.state.selectedExampleIndex}
            onChangeExample={this.handleChangeExample}
          />
        </div>
        <div className='last'>
          <div className='cta'>
           <p>
             Download the example, open it in your terminal and run
             <pre>npm install</pre>
             and
             {this.state.selectedExampleIndex === 2 ? (
               <pre>react-native run-ios <span className='darkBlue30'># or react-native run-android</span></pre>
             ) : (
               <pre>npm start</pre>
             )}
           </p>
          <Button button green hideArrow target={downloadUrl}>
            Download Example
          </Button>
          </div>
          <div className='bottom'>
            <div className='waiting'>
              <WaitingIndicator />
              <span>Waiting for you to initialize the app. Once you're done, come back here...</span>
            </div>
            <div className='skip' onClick={this.skip}>Skip</div>
          </div>
        </div>
      </div>
    )
  }

  private skip = () => {
    this.props.nextStep()
  }

  private handleChangeExample = (i: number) => {
    this.setState({selectedExampleIndex: i})
  }
}

export default connect(null, {nextStep})(SelectExample)

const examples: Example[] = [
  {
    name: 'React + Relay',
    path: 'react-graphql',
    subfolder: 'quickstart-with-relay-modern',
    logo1: require('graphcool-styles/icons/fill/reactLogo.svg'),
    logo2: require('graphcool-styles/icons/fill/relayLogo.svg'),
  },
  {
    name: 'React + Apollo',
    path: 'react-graphql',
    subfolder: 'quickstart-with-apollo',
    logo1: require('graphcool-styles/icons/fill/reactLogo.svg'),
    logo2: require('graphcool-styles/icons/fill/apolloLogo.svg'),
  },
  {
    name: 'React Native + Apollo',
    path: 'react-native-graphql',
    subfolder: 'quickstart-with-apollo',
    logo1: require('graphcool-styles/icons/fill/reactLogo.svg'),
    logo2: require('graphcool-styles/icons/fill/apolloLogo.svg'),
  },
  {
    name: 'Angular + Apollo',
    path: 'angular-graphql',
    subfolder: 'quickstart-with-apollo',
    logo1: require('graphcool-styles/icons/fill/angularLogo.svg'),
    logo2: require('graphcool-styles/icons/fill/apolloLogo.svg'),
  },
  {
    name: 'Vue + Apollo',
    path: 'vue-graphql',
    subfolder: 'quickstart-with-apollo',
    logo1: require('graphcool-styles/icons/fill/vueLogo.svg'),
    logo2: require('graphcool-styles/icons/fill/apolloLogo.svg'),
  },
]
