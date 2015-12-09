import React from 'react';
import Editors from './editors';

export default class extends React.Component {
    static propTypes = {
        modelDef: React.PropTypes.object.isRequired,
        model: React.PropTypes.object.isRequired,
        errors: React.PropTypes.object.isRequired,
        onFieldChange: React.PropTypes.func.isRequired
    }

    _renderField(field) {
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

    render() {
        return (<form>{this.props.modelDef.fields.map(field => this._renderField(field))}<pre>{JSON.stringify(this.props.model)}</pre></form>);
    }
}
