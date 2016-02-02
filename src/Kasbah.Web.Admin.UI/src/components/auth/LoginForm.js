import React from 'react';

export default class extends React.Component {
  handleSubmit (e) {
    e.preventDefault && e.preventDefault();

    const username = (this.refs.username.value || '').toString();
    const password = (this.refs.password.value || '').toString();

    if (username === '') {
      this.refs.username.focus();
    }
    else if (password === '') {
      this.refs.password.focus();
    }
    else {
      this.props.onSubmit(username, password, this.refs.persist.checked);
    }
  }

  handleReset () {
    this.refs.username.value = '';
    this.refs.password.value = '';
    this.refs.persist.checked = false;

    this.refs.username.focus();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.error) {
      this.refs.username.focus();
      this.refs.username.select();
    }
  }

  _renderField (id, type, placeholder, label) {
    let classes = ['control'];

    return (
      <fieldset className={classes.join(' ')}>
        <label htmlFor={id}>{label}</label>
        <input type={type} className='input' id={id} placeholder={placeholder} ref={id} />
      </fieldset>
    );
  }

  _renderError () {
    if (this.props.error) {
      return (
        <div className='notification is-danger'>
          <i className='fa fa-warning' /> {this.props.error}
        </div>
      );
    }

    return null;
  }

  render () {
    return (
      <form>
        {this._renderField('username', 'text', 'admin', 'Username')}
        {this._renderField('password', 'password', 'changeme', 'Password')}
        <fieldset className='control'>
          <label className='checkbox'>
            <input type='checkbox' ref='persist' /> Remember me
          </label>
        </fieldset>

        {this._renderError()}

        <div className='text-center'>
              <button type='reset'
                className='button'
                onClick={this.handleReset.bind(this)}>
                <span>Reset</span>
              </button>
              <button type='submit'
                className={['button', 'is-primary', this.props.loading ? 'is-loading' : null].join(' ')}
                onClick={this.handleSubmit.bind(this)}
                disabled={this.props.loading}>
                <span>Login</span>
              </button>
        </div>
      </form>
    );
  }
}
