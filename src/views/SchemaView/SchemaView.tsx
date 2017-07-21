import * as React from 'react'
import SchemaOverview from './SchemaOverview/SchemaOverview'
import SchemaEditor from './SchemaEditor'
import SchemaHeader from './SchemaHeader'
import * as Relay from 'react-relay/classic'
import {Viewer, Enum} from '../../types/types'
import ResizableBox from '../../components/ResizableBox'
import {throttle} from 'lodash'
import EnumsOverview from './EnumsOverview/EnumsOverview'
import {withRouter} from 'react-router'

interface Props {
  viewer: Viewer
  location: any
  params: any
  relay: any
  router: ReactRouter.InjectedRouter
  route: ReactRouter.Route
}

interface State {
  editorWidth: number
  typesChanged: boolean
  enumsChanged: boolean
  blur: boolean
  scroll: number
}

class SchemaView extends React.Component<Props, State> {
  private forceLeaveRoute: boolean = false
  private handleResize = throttle(
    (_, {size}) => {
      localStorage.setItem('schema-editor-width', size.width)
    },
    300,
  )

  constructor(props) {
    super(props)

    this.state = {
      editorWidth: parseInt(localStorage.getItem('schema-editor-width'), 10) || (window.innerWidth - 290) / 2,
      typesChanged: false,
      enumsChanged: false,
      blur: false,
      scroll: 0,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.rerender)
    this.addLeaveHook()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.rerender)
  }

  addLeaveHook() {
    this.props.router.setRouteLeaveHook(this.props.route, (nextLocation) => {
      if ((this.state.typesChanged || this.state.enumsChanged) && !this.forceLeaveRoute) {
        graphcoolConfirm('This action could lead to massive data loss.', 'Unsaved Changes')
          .then(() => {
            this.forceLeaveRoute = true
            this.props.router.push(nextLocation)
          })
        return false
      } else {
        return true
      }
    })
  }

  rerender = () => {
    this.forceUpdate()
  }

  render() {
    const {viewer, location, params} = this.props
    const {editorWidth, typesChanged, enumsChanged} = this.state
    const editingModelName = location.pathname.endsWith(`${params.modelName}/edit`) ? params.modelName : undefined
    const editingEnumName = location.pathname.endsWith(`edit/${params.enumName}`) ? params.enumName : undefined
    const isBeta = viewer.user.crm.information.isBeta
    const showEnums = location.pathname.includes('schema/enums')
    // scroll={this.state.scroll}
    return (
      <div className='schema-view'>
        <style jsx>{`
          .schema-view {
            @p: .flex, .flexColumn, .h100, .itemsStretch;
            background-color: rgb(11,20,28);
            border-left: 6px solid #08131B;
          }
          .schema-wrapper {
            @p: .flex, .h100, .pt6, .bgDarkBlue, .flexAuto;
          }
        `}</style>
        <SchemaHeader
          projectName={viewer.project.name}
          location={this.props.location}
          typesChanged={typesChanged}
          enumsChanged={enumsChanged}
        />
        <div className='schema-wrapper'>
          <ResizableBox
            id='schema-view'
            width={editorWidth}
            height={window.innerHeight - 64}
            hideArrow
            onResize={this.handleResize}
            axis='x'
          >
            <SchemaEditor
              project={viewer.project}
              forceFetchSchemaView={this.props.relay.forceFetch}
              onTypesChange={this.handleTypesChange}
              onEnumsChange={this.handleEnumsChange}
              isBeta={isBeta}
              setBlur={this.setBlur}
              showEnums={showEnums}
            />
          </ResizableBox>
          {showEnums ? (
            <EnumsOverview
              enums={mockEnums}
              location={location}
              project={viewer.project}
              editingEnumName={editingEnumName}
              blur={false}
              setScroll={() => {
                // comment for tslint
              }}
            />
          ) : (
            <SchemaOverview
              location={location}
              project={viewer.project}
              editingModelName={editingModelName}
              blur={isBeta ? this.state.blur : false}
              setScroll={this.scroll}
              params={this.props.params}
            />
          )}
        </div>
        {
          this.props.children &&
          React.cloneElement(this.props.children as any, {projectId: this.props.viewer.project.id})
        }
      </div>
    )
  }

  private handleTypesChange = typesChanged => {
    this.setState({typesChanged} as State)
  }
  private handleEnumsChange = enumsChanged => {
    this.setState({enumsChanged} as State)
  }

  private setBlur = (blur: boolean) => {
    this.setState({blur} as State)
  }

  private scroll = (n: number) => {
    this.setState({scroll: n} as State)
  }
}

export default Relay.createContainer(withRouter(SchemaView), {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        project: projectByName(projectName: $projectName) {
          id
          name
          ${SchemaEditor.getFragment('project')}
          ${SchemaOverview.getFragment('project')}
          ${EnumsOverview.getFragment('project')}
        }
        user {
          crm {
            information {
              isBeta
            }
          }
        }
      }
    `,
  },
})

const mockEnums: Enum[] = [
  {
    id: 'role23',
    name: 'Role',
    values: ['Admin', 'User', 'Guest'],
  },
  {
    id: 'wood2',
    name: 'Wood',
    values: ['Beech', 'Oak', 'Fir', 'Mahagony'],
  },
]
