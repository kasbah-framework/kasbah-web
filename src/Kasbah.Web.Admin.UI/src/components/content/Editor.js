import React from 'react';
import Editors from './editors';

export default class Editor extends React.Component {
    static propTypes = {
      node: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired,
      values: React.PropTypes.object.isRequired,

      onFieldChange: React.PropTypes.func.isRequired
    };

    constructor () {
      super();

      this.state = {
        activeSection: null
      };
    }

    componentWillMount () {
      if (this.props.model) {
        this.setState({
          activeSection: this.props.model.sections[0].displayName
        });
      }
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.model !== this.props.model) {
        this.setState({
          activeSection: nextProps.model.sections[0].displayName
        });
      }
    }

    _renderField (field, index) {
      let editor = Editors.Text;
      for (var ent in Editors) {
        if (Editors[ent].alias === field.type) {
          editor = Editors[ent];
        }
      }

      const editorProps = {
        field: field,
        onChange: this.props.onFieldChange.bind(this),
        value: this.props.values[field.alias]
      };

      const editorEl = React.createElement(editor, editorProps);

      return (
        <fieldset className='control' key={index}>
          <label htmlFor={field.alias} className='control-label'>{field.displayName}</label>
          {editorEl}
        </fieldset>);
    }

    renderSection (section) {
      if (!section) {
        return null;
      }

      return this.props
        .model
        .fields
        .filter(ent => ent.section === section)
        .map((ent, index) => this._renderField(ent, index));
    }

    render () {
      return (
        <form>
          <div className='tabs is-toggle'>
            <ul>
              {this.props.model.sections
                .map((ent, index) => (
                  <li key={index} className={this.state.activeSection === ent.displayName ? 'is-active' : null}>
                    <a onClick={() => this.setState({ activeSection: ent.displayName })}>{ent.displayName}</a>
                  </li>))}
            </ul>

            <div>
              {this.renderSection(this.state.activeSection)}
            </div>
          </div>
        </form>);
    }
}
