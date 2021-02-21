import React, { Component } from 'react';
import { config } from '../../config';
import Oidc from 'oidc-client';
import BusyIndicator from '../../components/busyIndicator';

class LoginPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false
        }

        if (typeof window !== 'undefined') {
            var that = this;

            this.usermanger = new Oidc.UserManager(config.authConfig);

            this.usermanger.getUser().then(function (user) {
                if (user) {
                    that.setState({
                        isLoggedIn: true
                    });
                }
            });
        }

        this.signin = this.signin.bind(this);
        this.signout = this.signout.bind(this);
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            var that = this;

            this.signin();
        }
    }

    signin() {
        this.usermanger.signinRedirect();
    }

    signout() {
        this.usermanger.signoutRedirect();
    }

    render() {
        return <BusyIndicator message="Redirecting to Login Page"/>
    }
}

export default LoginPage;