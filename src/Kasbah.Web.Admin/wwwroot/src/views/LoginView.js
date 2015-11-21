import React from 'react';

export default class extends React.Component {
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
              <form>
                <fieldset className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" className="form-control" id="username" placeholder="Enter username" />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Enter password" />
                </fieldset>

                {errorMessage}

                <div className="text-center">
                  <button type="submit" className="btn btn-lg btn-primary">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
