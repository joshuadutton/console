import * as React from 'react'
import FieldHorizontalSelect from '../../models/FieldPopup/FieldHorizontalSelect'
import {Icon, $v} from 'graphcool-styles'
import {EventType, eventTypes} from './FunctionPopup'
import InfoBox from './InfoBox'
import Info from '../../../components/Info'
import Select from './Select'
import {Model} from '../../../types/types'

interface Props {
  eventType: EventType | null
  onChangeEventType: (eventType: EventType) => void
  sssModelName: string
  onChangeSSSModel: (e: any) => void
  models: Model[]
  isBeta: boolean
}

export default class Step0 extends React.Component<Props, {}> {

  render() {
    const {eventType, onChangeEventType, sssModelName, onChangeSSSModel, models, isBeta} = this.props
    let choices: Array<JSX.Element | string> = [
      <div className='flex itemsCenter' data-test='choose-sss'>
        <Icon
          src={require('graphcool-styles/icons/fill/serversidesubscriptions.svg')}
          width={40}
          height={20}
          color={$v.darkBlue50}
        />
        <div className='ml16'>
          Server-Side Subscription
        </div>
      </div>,
      <div className='flex itemsCenter' data-test='choose-rp'>
        <Icon
          src={require('graphcool-styles/icons/fill/requestpipeline.svg')}
          width={40}
          height={20}
          color={$v.darkBlue50}
        />
        <div className='ml16'>
          Request Pipeline
        </div>
      </div>,
      /*
      */
    ]
    if (isBeta) {
      choices.push(
        <div className='flex itemsCenter' data-test='choose-rp'>
          <Icon
            src={require('assets/icons/schema.svg')}
            width={16}
            height={16}
            color={$v.darkBlue30}
          />
          <div className='ml10'>
            Schema Extension
          </div>
        </div>,
)
    }

    return (
      <div className='step0'>
        <style jsx>{`
          .step0 {
          }
          .intro {
            @p: .pl38, .pr38, .black50;
            margin-top: 8px;
          }
          .sss-intro {
            @p: .darkBlue50;
          }
        `}</style>
        <div className='intro'>
          Choose the type of function, you want to define. <br/>
        </div>
        <FieldHorizontalSelect
          activeBackgroundColor={$v.blue}
          inactiveBackgroundColor='#F5F5F5'
          choices={choices}
          selectedIndex={eventTypes.indexOf(eventType)}
          inactiveTextColor={$v.gray30}
          onChange={(index) => onChangeEventType(eventTypes[index])}
          spread
        />
        {eventType === 'SSS' && (
          <div className='flex itemsCenter ml38 mb38'>
            <div className='sss-intro'>Use one of your types to act as a trigger:</div>
            <Select
              value={sssModelName}
              onChange={onChangeSSSModel}
              className='ml38'
            >
              {models.map(model => (
                <option value={model.name} key={model.name}>{model.name}</option>
              ))}
            </Select>
          </div>
        )}
        <div className='mh38 mb38'>
          <InfoBox>
            {this.getInfoText()}
          </InfoBox>
        </div>
      </div>
    )
  }

  private getInfoText = () => {
    const {eventType} = this.props

    if (eventType === 'RP') {
      return `The Request Pipeline lets you transform data at each step of the data processing process.
      This allows you to transform what data comes into the database and comes out.
      Here you can, for example, charge a Stripe payment or implement custom validation logic.`
    }

    if (eventType === 'SSS') {
      return `Server-side subscriptions give you the ability to react to events like mutations.
      You could for example send emails everytime a user signs up or use it for logging.`
    }

    if (eventType === 'SCHEMA_EXTENSION') {
      return `With a Schema Extension you can provide custom queries and mutations that are powered by a function
      that you provide.`
    }

    return 'You can’t change the function type after you created the function.'
  }
}
