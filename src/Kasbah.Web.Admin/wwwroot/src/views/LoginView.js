import React from 'react';
import LoginForm from 'components/auth/LoginForm';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  handleSubmit(username, password) {
    this.setState({ loading: true });
    setTimeout(x => {
      this.setState({ error: 'Invalid username or password.', loading: false });
    }, 1000)

    console.log(username, password);
  }

  render() {
    const errorMessage = (
      <div className="alert alert-danger">
        <i className="fa fa-warning" /> This will only be displayed on authentication failure.
      </div>);

    return (
      <div className="flex-centred">
        <div className="col-lg-5 col-md-6 col-sm-10">
          <div className="card">
            <div className="card-block">
              <h4 className="card-title">Administration login</h4>
              <h6 className="card-subtitle text-muted">Enter your credentials below to access the content administration website</h6>
            </div>
            <div className="card-block">
              <LoginForm onSubmit={this.handleSubmit.bind(this)} loading={this.state.loading} error={this.state.error} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
