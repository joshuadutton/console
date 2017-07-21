import * as React from 'react'
import HorizontalSelect from './HorizontalSelect'
import {$v,Icon} from 'graphcool-styles'
import EditValueInput from './EditValueInput'
import ErrorInfo from './ErrorInfo'
import {FieldPopupErrors} from './FieldPopupState'
import {TypedValue} from '../../../types/utils'
import {CellRequirements, getEditCell} from '../DatabrowserView/Cell/cellgenerator'
import {Enum, Field} from '../../../types/types'
import {valueToString} from '../../../utils/valueparser'
import InfoBox from '../../FunctionsView/FunctionPopup/InfoBox'
import Info from '../../../components/Info'

interface Props {
  style?: any
  isRequired: boolean
  onToggleIsRequired: () => void
  defaultValue?: TypedValue
  migrationValue?: TypedValue
  onChangeDefaultValue: (value: TypedValue) => void
  onChangeMigrationValue: (value: TypedValue) => void
  showMigration: boolean
  migrationOptional: boolean
  showErrors: boolean
  errors: FieldPopupErrors
  field: Field
  projectId: string
  enums: Enum[]
}

// export type MigrationType = 'VALUE' | 'FUNCTION'

export default class AdvancedSettings extends React.Component<Props, null> {
  render() {
    const {
      style,
      isRequired,
      onToggleIsRequired,
      defaultValue,
      onChangeDefaultValue,
      showMigration,
      migrationOptional,
      showErrors,
      errors,
      projectId,
      migrationValue,
      onChangeMigrationValue,
      enums,
      field,
    } = this.props
    const mandatoryClass = migrationOptional ? '' : 'mandatory'

    return (
      <div style={style} className='advanced-settings'>
        <style jsx>{`
          .advanced-settings {
            @p: .w100;
            margin-top: 14px;
          }
          .is-required {
            @p: .flex, .itemsCenter, .pl38, .pb38;
          }
          .is-required-text {
            @p: .mr16, .ttu, .f14, .black30, .fw6;
          }
          .default-value {
            @p: .pb38, .pl38;
          }
          .migration-title-wrapper {
            @p: .bb, .bBlack10, .flex, .justifyCenter, .mb38, .w100, .mt16, .pt4;
          }
          .migration-title-wrapper.mandatory {
            border-color: rgba(241,143,1,0.3);
          }
          .migration-title {
            @p: .bgWhite, .ph10, .black50, .flex, .relative, .itemsCenter;
            bottom: -12px;
          }
          .migration-title.mandatory {
            @p: .lightOrange;
          }
          .edit-label {
            @p: .f16, .ml16;
            color: rgba(0,0,0,.4);
          }
          .edit-label.mandatory {
            @p: .lightOrange;
          }
          .edit-label-wrapper {
            @p: .flex, .itemsCenter, .pointer, .bbox, .pl38, .pv38;
          }
          .already-data {
            @p: .ph38, .f16, .black50;
          }
          .already-data.mandatory {
            @p: .lightOrange;
          }
          .migration-header {
            @p: .flex, .itemsCenter;
          }
          .migration-switch {
            @p: .pr38;
          }
          .input {
            @p: .pv38, .pl38, .f16, .fw6;
          }
          .migration-error {
            @p: .absolute;
            margin-top: -125px;
            right: 10px;
          }
          .migration-input-wrapper {
            @p: .ph38, .flex, .justifyCenter, .pb38, .pt16;
          }
          .migration-input {
            @p: .relative;
          }
          pre {
            @p: .purple, .code, .br2, .bgDarkBlue04, .mh4, .dib, .f10;
            padding: 2px 4px 1px 4px;
          }
        `}
        </style>
        <style jsx global>{`
          .advanced-settings .rdt .form-control {
            @p: .w100;
          }
          .field-popup .migration-input input {
            background: none;
          }
        `}</style>
        <div className='is-required'>
          <div className='is-required-text'>This Field is</div>
          <HorizontalSelect
            selectedIndex={isRequired ? 0 : 1}
            choices={['Required', 'Optional']}
            activeBackgroundColor={$v.blue}
            onChange={onToggleIsRequired}
          />
        </div>
        <div className={`migration-title-wrapper`}>
          <div className={`migration-title`}>Default value (optional)</div>
        </div>
        <div className='default-value'>
          <EditValueInput
            placeholder='add default value'
            value={defaultValue}
            onChangeValue={onChangeDefaultValue}
            field={field}
            projectId={projectId}
            optional={!isRequired}
            enums={this.props.enums}
          />
        </div>
        {showMigration && (
          <div>
            <div className={`migration-title-wrapper ${mandatoryClass}`}>
              <div className={`migration-title ${mandatoryClass}`}>
                Migration ({migrationOptional ? 'optional' : 'required'})
                <Info
                  width={300}
                >
                  For scalar fields, the migration value is applied to all <pre>null</pre> values.
                  For list fields, the migration value is applied to all values.
                </Info>
              </div>
            </div>
            <div className='migration-header'>
              <div className={`already-data ${mandatoryClass}`}>
                You already have data.
                {migrationOptional ? (
                  ' You can set up a default values for all existing nodes.'
                ) : (
                  ' Set up the migration for existing nodes.'
                )}
               </div>
              {/*(editingMigration || !migrationOptional) && (
                <div className='migration-switch'>
                  <HorizontalSelect
                    selectedIndex={this.state.activeMigrationType === 'VALUE' ? 0 : 1}
                    activeBackgroundColor={migrationOptional ? $v.blue : $v.lightOrange}
                    choices={['VALUE', 'FUNCTION']}
                    onChange={(_, type: MigrationType) => this.setMigrationType(type)}
                  />
                </div>
              )*/}
            </div>
            <div className='migration-input-wrapper'>
              <EditValueInput
                placeholder='add migration value'
                value={migrationValue}
                onChangeValue={onChangeMigrationValue}
                field={field}
                projectId={projectId}
                optional={!isRequired}
                enums={this.props.enums}
              />
            </div>
            {showErrors && errors.migrationValueMissing && (
              <div className='migration-error'>
                <ErrorInfo>
                  As you changed your field, you need to specify a migration value.
                </ErrorInfo>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}
