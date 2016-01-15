import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginForm from 'components/auth/LoginForm';
import * as actionCreators from '../redux/modules/auth';

const mapStateToProps = (state) => ({
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export class LoginView extends React.Component {
    handleSubmit (username, password, persist) {
      this.props.actions.loginUser(username, password, persist);
    }

    render () {
      return (
            <div className='flex-centred login-view'>
                <div className='col-lg-3 col-md-6 col-sm-10'>
                    <div className='card'>
                        <div className='card-block'>
                            <h4 className='card-title'>Kasbah Login</h4>
                            <h6 className='card-subtitle text-muted'>Enter your credentials below to access the content administration website.</h6>
                        </div>
                        <div className='card-block'>
                            <LoginForm onSubmit={this.handleSubmit.bind(this)} loading={this.props.auth.isAuthenticating} error={this.props.auth.errorMessage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
