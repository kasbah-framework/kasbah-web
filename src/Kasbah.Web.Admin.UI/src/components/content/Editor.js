import React from 'react';
import Editors from './editors';

export default class extends React.Component {
    static propTypes = {
      node: React.PropTypes.string.isRequired,
      modelDefinition: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired,
      errors: React.PropTypes.object.isRequired,
      onFieldChange: React.PropTypes.func.isRequired
    };

    constructor () {
      super();

      this.state = {
        activeSection: null
      };
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.node !== this.props.node) {
        this.setState({
          activeSection: nextProps.modelDefinition.sections[0]
        });
      }
    }

    _renderField (field) {
      let editor = Editors.Text;
      for (var ent in Editors) {
        if (Editors[ent].alias === field.type) {
          editor = Editors[ent];
        }
      }

      const editorEl = React.createElement(editor, { field: field, onChange: this.props.onFieldChange.bind(this), value: this.props.model[field.alias] });

      return (
        <fieldset className='control' key={field.alias}>
          <label htmlFor={field.alias} className='control-label'>{field.displayName}</label>
          {editorEl}
          {this.props.errors[field.alias] && (<p className='help-block'>{this.props.errors[field.alias]}</p>)}
        </fieldset>);
    }

    renderSection (section) {
      if (!section) {
        return null;
      }

      return this.props
        .modelDefinition
        .fields
        .filter(ent => ent.section === section)
        .map(field => this._renderField(field));
    }

    handleSectionChange (section) {
      this.setState({
        activeSection: section
      });
    }

    render () {
      const tabs = this.props.modelDefinition.sections;
      return (
        <form>
          <div className='tabs is-toggle'>
            <ul>
              {tabs.map(ent => <li key={ent} className={this.state.activeSection === ent ? 'is-active' : null}><a onClick={() => this.handleSectionChange(ent)}>{ent}</a></li>)}
            </ul>

            <div>
              {this.renderSection(this.state.activeSection)}
            </div>
          </div>
        </form>);
    }
}
