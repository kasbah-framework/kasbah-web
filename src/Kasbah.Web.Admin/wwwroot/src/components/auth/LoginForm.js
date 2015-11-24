import React from 'react';

export default class extends React.Component {
  constructor() {
    super();

    this.state = { 'errors': {} };
  }

  handleSubmit(e) {
    e.preventDefault && e.preventDefault();

    const username = (this.refs.username.value || '').toString();
    const password = (this.refs.password.value || '').toString();
    let errors = {};

    if (username === '' || password === '') {
      if (username === '') { errors['username'] = 'Required field' };
      if (password === '') { errors['password'] = 'Required field' };

      this.refs[Object.keys(errors)[0]].focus();
    }
    else {
      this.props.onSubmit(username, password, this.refs.persist.checked);
    }

    this.setState({ 'errors': errors });
  }

  handleReset() {
    this.refs.username.value = '';
    this.refs.password.value = '';
    this.refs.persist.checked = false;

    this.refs.username.focus();

    this.setState({ 'errors': {} });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.refs.username.focus();
      this.refs.username.select();
    }
  }

  _renderField(id, type, placeholder, label, errors) {
    let classes = ['form-group'];
    if (errors[id]) {
      classes.push('has-error');
    }

    return (
      <fieldset className={classes.join(' ')}>
        <label htmlFor={id} className='control-label'>{label}</label>
        <input type={type} className='form-control' id={id} placeholder={placeholder} ref={id} />
        {errors[id] && (<p className='help-block'>{errors[id]}</p>)}
      </fieldset>
    );
  }

  render() {
    const errorMessage = this.props.error ? (
      <div className='alert alert-danger'>
        <i className='fa fa-warning' /> {this.props.error}
      </div>) : null;

    return (
        <form>
          {this._renderField('username', 'text', 'Enter username', 'Username', this.state.errors)}
          {this._renderField('password', 'password', 'Enter password', 'Password', this.state.errors)}
          <fieldset className='form-group checkbox'>
            <label>
              <input type='checkbox' ref='persist' /> Remember me
            </label>
          </fieldset>

          {errorMessage}

          <div className='text-center'>
            <button type='reset'
              className='btn btn-secondary'
              onClick={this.handleReset.bind(this)}>Reset</button>
            <button type='submit'
              className='btn btn-lg btn-primary'
              onClick={this.handleSubmit.bind(this)}
              disabled={this.props.loading}>
                {this.props.loading && (<i className='fa fa-spinner fa-spin' />)}
                <span>Login</span>
              </button>
          </div>
        </form>
    );
  }
}
