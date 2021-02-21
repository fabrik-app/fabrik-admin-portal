import React, { Component } from 'react';
import Link from 'next/link';
import { config } from '../config';
import Oidc from 'oidc-client';
import AccountMenu from '../components/accountMenu';
import { UserContext } from '../contexts/user-context';

class TopNavigation extends Component {

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

            this.usermanger.getUser().then(function (user) {
                if (user) {
                    that.setState({
                        isLoggedIn: true
                    });
                }
            });
        }
    }

    signin() {
        this.usermanger.signinRedirect();
    }

    signout() {
        this.usermanger.signoutRedirect();
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        let accountSection;
        if (isLoggedIn) {
            accountSection =
                <li className="nav-item dropdown ml-auto">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> My Account</a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item" href="#" onClick={() => { this.signout() }}>Logout</a>
                    </div>
                </li>
        } else {
            accountSection =
                <React.Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => { this.signin() }}>Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="https://accounts.fabrik.in/account/register?returnUrl=https://fabrik.in">Register</a>
                    </li>
                </React.Fragment>
        }
        return (<nav className="navbar navbar-light navbar-expand-lg shadow-sm bg-white">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <Link href="/">
                <a className="navbar-brand">{config.appName}</a>
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <ul className="navbar-nav ml-auto">
                    <UserContext.Consumer>
                        {(user) => (
                            <AccountMenu user={user} />
                        )}
                    </UserContext.Consumer>
                </ul>
                {/* <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form> */}
            </div>
        </nav>);
    }
}

export default TopNavigation;