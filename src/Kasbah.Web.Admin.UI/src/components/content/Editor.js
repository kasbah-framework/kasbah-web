import React from 'react';
import Editors from './editors';
import { Tab, Tabs, TabList , TabPanel } from 'react-tabs';

export default class extends React.Component {
    static propTypes = {
      modelDefinition: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired,
      errors: React.PropTypes.object.isRequired,
      onFieldChange: React.PropTypes.func.isRequired
    };

    _renderField (field) {
      let editor = Editors.Text;
      for (var ent in Editors) {
        if (Editors[ent].alias === field.type) {
          editor = Editors[ent];
        }
      }

      const editorEl = React.createElement(editor, { field: field, onChange: this.props.onFieldChange.bind(this), value: this.props.model[field.alias] });

      return (
            <fieldset className='form-group' key={field.alias}>
                <label htmlFor={field.alias} className='control-label'>{field.displayName}</label>
                {editorEl}
                {this.props.errors[field.alias] && (<p className='help-block'>{this.props.errors[field.alias]}</p>)}
            </fieldset>);
    }

    renderSection(section) {
      return this.props
        .modelDefinition
        .fields
        .filter(ent => ent.section == section)
        .map(field => this._renderField(field));
    }

    render () {
      const tabs = this.props.modelDefinition.sections;
      return (
        <form>
          <Tabs>
            <TabList>
              {tabs.map(ent => <Tab key={ent}>{ent}</Tab>)}
            </TabList>

          {tabs.map((ent, index) => <TabPanel key={index}>{this.renderSection(ent)}</TabPanel>)}
          </Tabs>
        </form>);
    }
}
