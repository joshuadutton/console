import * as React from 'react'
import CurrentPlan from './CurrentPlan'
import Usage from './Usage'
import CreditCardInformation from './CreditCardInformation'
import {chunk, mmDDyyyyFromTimestamp} from '../../../utils/utils'
import * as Relay from 'react-relay'
import {Viewer, Invoice, CreditCardInfo} from '../../../types/types'
import {creditCardNumberValid, expirationDateValid, cpcValid} from '../../../utils/creditCardValidator'
import SetCreditCardMutation from '../../../mutations/SetCreditCardMutation'
import Loading from '../../../components/Loading/Loading'

interface State {
  newCreditCardNumber: string
  newCardHolderName: string
  newExpirationDate: string
  newCPC: string
  isEditingCreditCardInfo: boolean

  newAddressLine1: string
  newAddressLine2: string
  newZipCode: string
  newState: string
  newCity: string
  newCountry: string

  creditCardDetailsValid: boolean
  addressDataValid: boolean

  isLoading: boolean
}

interface Props {

  viewer: Viewer
  node: Node
  location: any
  params: any
  projectName: string

  cpc: string
  children: JSX.Element

}

class Billing extends React.Component<Props, State> {

  constructor(props) {
    super(props)

    const project = props.viewer.crm.crm.customer.projects.edges.find(edge => {
      return edge.node.name === this.props.projectName
    }).node

    const creditCard = project.projectBillingInformation.creditCard
    const expirationDate = creditCard ?  creditCard.expirationMonth + '/' + creditCard.expirationYear : ''

    this.state = {

      newCreditCardNumber: creditCard ? 'XXXX XXXX XXXX ' + creditCard.last4 : '',
      newCardHolderName: creditCard ? creditCard.name : '',
      newExpirationDate: expirationDate,
      newCPC: '',
      newAddressLine1: creditCard ? creditCard.addressLine1 : '',
      newAddressLine2: creditCard ? creditCard.addressLine2 : '',
      newZipCode: creditCard ? creditCard.addressZip : '',
      newState: creditCard ? creditCard.addressState : '',
      newCity: creditCard ? creditCard.addressCity : '',
      newCountry: creditCard ? creditCard.addressCountry : '',

      // newCreditCardNumber: 'XXXX XXXX XXXX 8345',
      // newCardHolderName: 'Nikolas Burk',
      // newExpirationDate: '07/21',
      // newCPC: '123',
      // newAddressLine1: 'Hufnertwiete 2',
      // newAddressLine2: '',
      // newZipCode: '22305',
      // newState: 'HH',
      // newCity: 'Hamburg',
      // newCountry: 'Germany',

      isEditingCreditCardInfo: false,

      creditCardDetailsValid: true,
      addressDataValid: true,

      isLoading: false,
    }

    Stripe.setPublishableKey('pk_test_BpvAdppmXbqmkv8NQUqHRplE')
  }

  render() {

    const seats = this.props.viewer.project.seats.edges.map(edge => edge.node.name)
    const project = this.props.viewer.crm.crm.customer.projects.edges.find(edge => {
      return edge.node.name === this.props.projectName
    }).node
    const invoices: Invoice[] = project.projectBillingInformation.invoices.edges.map(edge => edge.node)
    const currentInvoice = invoices[invoices.length - 1]

    return (
      <div className={`container ${this.state.isEditingCreditCardInfo && 'bottomPadding'}`}>
        <style jsx={true}>{`

          .container {
            @p: .br;
            max-width: 700px;
            border-color: rgba( 229, 229, 229, 1);
          }

          .bottomPadding {
            padding-bottom: 110px;
          }

          .loadingContainer {
            @p: .absolute, .flex, .itemsCenter, .justifyCenter;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            background-color: rgb(250,250,250);
          }

        `}</style>
        <CurrentPlan
          plan={project.projectBillingInformation.plan}
          projectName={this.props.params.projectName}
        />
        <Usage
          usedSeats={seats}
          plan={project.projectBillingInformation.plan}
          currentNumberOfRequests={currentInvoice.usageRequests.reduce((a,b) => a + b)}
          lastInvoiceDate={mmDDyyyyFromTimestamp(currentInvoice.timestamp)}
          usedStoragePerDay={currentInvoice.usageStorage}
          overageRequests={currentInvoice.overageRequests}
          overageStorage={currentInvoice.overageStorage}
        />
        {!this.state.isLoading ?
          project.projectBillingInformation.creditCard && (
            <CreditCardInformation
              creditCardNumber={this.state.newCreditCardNumber}
              cardHolderName={this.state.newCardHolderName}
              expirationDate={this.state.newExpirationDate}
              cpc={this.state.newCPC}
              onCreditCardNumberChange={this.updateCreditCardNumber}
              onCardHolderNameChange={(newValue) => this.setState({newCardHolderName: newValue} as State)}
              onExpirationDateChange={this.updateExpirationDate}
              onCPCChange={this.updateCPC}
              setEditingState={this.setEditingState}
              isEditing={this.state.isEditingCreditCardInfo}
              addressLine1={this.state.newAddressLine1}
              addressLine2={this.state.newAddressLine2}
              zipCode={this.state.newZipCode}
              state={this.state.newState}
              city={this.state.newCity}
              country={this.state.newCountry}
              creditCardDetailsValid={this.state.creditCardDetailsValid}
              addressDataValid={this.state.addressDataValid}
              onAddressDataChange={this.onAddressDataChange}
              onSaveChanges={this.initiateUpdateCreditCard}
              invoices={invoices}
            />
          )
          :
          (
            <div className='loadingContainer'>
              <Loading/>
            </div>
          )
        }

        {this.props.children}
      </div>
    )
  }

  private updateCPC = (newValue) => {
    let newCPC
    if (newValue.length > 3) {
      newCPC = newValue.substr(0, 3)
    } else {
      newCPC = newValue
    }
    this.setState({newCPC: newCPC} as State)
  }

  private updateExpirationDate = (newValue) => {
    if (newValue.length > 5) {
      return
    }
    this.setState({newExpirationDate: newValue} as State)

    // let newExpirationDate
    // let expirationDateWithoutSlash = newValue.replace('/', '')
    // console.log('expirationDateWithoutSlash', expirationDateWithoutSlash)
    // if (expirationDateWithoutSlash.length <= 2) {
    //   newExpirationDate = newValue + '/'
    //   this.setState({newExpirationDate: newExpirationDate} as State)
    // } else {
    //   this.setState({newExpirationDate: newValue} as State)
    // }
  }

  private updateCreditCardNumber = (newValue) => {

    // pasting
    if (newValue.length > 4 && !newValue.includes(' ')) {
      const chunks = chunk(newValue, 4, true)
      const newCreditCardNumber = chunks.join(' ')
      this.setState({newCreditCardNumber: newCreditCardNumber} as State)
      return
    }

    // regular typing
    let creditCardComponents = newValue.split(' ')
    const lastComponent = creditCardComponents[creditCardComponents.length - 1]

    if (newValue.length >= 20) {
      return
    }

    let newLastComponent
    if (creditCardComponents.length < 4 && lastComponent.length === 4) {
      newLastComponent = lastComponent + ' '
    } else {
      newLastComponent = lastComponent
    }

    creditCardComponents[creditCardComponents.length - 1] = newLastComponent
    const newCreditCardNumber = creditCardComponents.join(' ')
    this.setState(
      {newCreditCardNumber: newCreditCardNumber} as State,
      () => this.validateCreditCardDetails(),
    )
  }

  private setEditingState = (isEditing: boolean, saveChanges: boolean) => {
    this.setState({isEditingCreditCardInfo: isEditing} as State)
  }

  private validateAddressDetails = () => {
    const addressLine1Valid = this.state.newAddressLine1.length > 0
    const zipcodeValid = this.state.newZipCode.length > 0
    const stateValid = this.state.newState.length > 0
    const cityValid = this.state.newCity.length > 0
    const countryValid = this.state.newCountry.length > 0
    const addressValid = addressLine1Valid && zipcodeValid && stateValid && cityValid && countryValid

    if (addressValid) {
      this.setState({addressDataValid: true} as State)
    }
  }

  private validateCreditCardDetails = () => {
    const isCreditCardNumberValid = creditCardNumberValid(this.state.newCreditCardNumber)
    const isExpirationDateValid = expirationDateValid(this.state.newExpirationDate)
    const isCPCValid = cpcValid(this.state.newCPC)
    if (isCreditCardNumberValid && isExpirationDateValid && isCPCValid) {
      this.setState({creditCardDetailsValid: true} as State)
    }
  }

  private onAddressDataChange = (fieldName: string, newValue: string) => {
    switch (fieldName) {
      case 'addressLine1':
        this.setState(
          {newAddressLine1: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      case 'addressLine2':
        this.setState(
          {newAddressLine2: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      case 'city':
        this.setState(
          {newCity: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      case 'zipCode':
        this.setState(
          {newZipCode: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      case 'state':
        this.setState(
          {newState: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      case 'country':
        this.setState(
          {newCountry: newValue} as State,
          () => this.validateAddressDetails(),
        )
        break
      default:
        break
    }
  }

  private initiateUpdateCreditCard = () => {

    const expirationDateComponents = this.state.newExpirationDate.split('/')
    const expirationMonth = expirationDateComponents[0]
    const expirationYear = expirationDateComponents[1]

    this.setState({isLoading: true} as State)

    if (this.state.creditCardDetailsValid && this.state.addressDataValid) {
      Stripe.card.createToken(
        {
          number: this.state.newCreditCardNumber,
          cvc: this.state.newCPC,
          exp_month: expirationMonth,
          exp_year: expirationYear,
          name: this.state.newCardHolderName,
          address_line1: this.state.newAddressLine1,
          address_line2: this.state.newAddressLine2,
          address_city: this.state.newCity,
          address_state: this.state.newState,
          address_zip: this.state.newZipCode,
          address_country: this.state.newCountry,
        },
        this.stripeResponseHandler,
      )
    }

  }

  private stripeResponseHandler = (status, response) => {

    if (response.error) {
      console.error(response.error)
      this.setState({isLoading: false} as State)
      return
    }

    const token = response.id

    Relay.Store.commitUpdate(
      new SetCreditCardMutation({
        projectId: this.props.viewer.project.id,
        token: token,
      }),
      {
        onSuccess: () => {
          // this.props.showNotification({message: 'Invite sent to: ' + email, level: 'success'})
          this.setState({
            isEditingCreditCardInfo: false,
            isLoading: false,
          } as State)
        },
        onFailure: (transaction) => {
          // this.props.showNotification({message: transaction.getError().message, level: 'error'})
          this.setState({isLoading: false} as State)
          console.error('error in setting new credit card', transaction.getError().message)
        },
      },
    )
  }

}

export default Relay.createContainer(Billing, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          name
          seats(first: 1000) {
            edges {
              node {
                name
              }
            }
          }
        },
        crm: user {
          name
          crm {
            customer {
              id
              projects(first: 1000) {
                edges {
                  node {
                    name
                    projectBillingInformation {
                      plan
                      invoices(first: 1000)  {
                        edges {
                          node {
                            overageOperations
                            overageRequests
                            usageRequests
                            usageStorage
                            usedSeats
                            timestamp
                            total
                          }
                        }
                      }
                      creditCard {
                        addressCity
                        addressCountry
                        addressLine1
                        addressLine2
                        addressState
                        addressZip
                        expMonth
                        expYear
                        last4
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `},
})
