import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoginForm from 'components/auth/LoginForm';
import { actions as authActions } from '../redux/modules/auth';

export class LoginView extends React.Component {
    static propTypes = {
      auth: React.PropTypes.object.isRequired,
      loginUser: React.PropTypes.func.isRequired,
      location: React.PropTypes.object.isRequired
    };

    static contextTypes = {
      router: React.PropTypes.object.isRequired
    };

    handleSubmit (username, password, persist) {
      this.props.loginUser(username, password, persist);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            sessionStorage.isAuthenticated = true;

            const { history } = this.context;
            const { location } = this.props;

            if (location.state && location.state.nextPathname) {
                this.context.router.push(location.state.nextPathname);
            } else {
                this.context.router.push('/');
            }
        }
    }

    render () {
      return (
            <div className='is-fullheight'>
                <section className='hero'>
                    <div className='hero-content'>
                        <div className='container'>
                            <div className='columns'>
                                <div className='column' />
                                <div className='column is-4'>
                                    <h1 className='title'>Login</h1>
                                    <LoginForm onSubmit={this.handleSubmit.bind(this)} loading={this.props.auth.isAuthenticating} error={this.props.auth.errorMessage} />
                                </div>
                                <div className='column' />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

const actions = {
  loginUser: authActions.loginUser,
};

export default connect(mapStateToProps, actions)(LoginView);
