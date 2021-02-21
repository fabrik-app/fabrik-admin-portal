import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { config } from '../config';
import Oidc from 'oidc-client';
import Cookie from "js-cookie";

class AccountMenu extends React.Component {

    constructor(props) {
        super(props);

        if (typeof window !== 'undefined') {

            this.usermanger = new Oidc.UserManager(config.authConfig);
        }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login() {
        this.usermanger.signinRedirect({ state: Router.asPath });
    }

    logout() {
        Cookie.remove("fabrik.authToken");
        this.usermanger.signoutRedirect();
    }

    render() {
        let accountSection;
        if (this.props.user.isLoggedIn) {
            accountSection =
                <React.Fragment>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">Home</a>
                        </Link>
                    </li>
                    <li className="nav-item dropdown ml-auto">
                        <a className="nav-link dropdown-toggle" href="#" id="manageDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Manage</a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                            <Link href="/stores">
                                <a className="dropdown-item">Stores</a>
                            </Link>
                            <Link href="/designers">
                                <a className="dropdown-item">Designers</a>
                            </Link>
                            <Link href="/medias">
                                <a className="dropdown-item">Medias</a>
                            </Link>
                            <Link href="/products">
                                <a className="dropdown-item">Products</a>
                            </Link>
                            <Link href="/leads">
                                <a className="dropdown-item">Leads</a>
                            </Link>
                            <Link href="/cities">
                                <a className="dropdown-item">Cities</a>
                            </Link>
                            <Link href="/settings/templates">
                                <a className="dropdown-item">Templates</a>
                            </Link>
                            <Link href="/users">
                                <a className="dropdown-item">Users</a>
                            </Link>
                            <Link href="/contacts">
                                <a className="dropdown-item">Contacts</a>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item dropdown ml-auto">
                        <a className="nav-link dropdown-toggle" href="#" id="analyticsDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Analytics</a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                            <Link href="/analytics/searchlogs">
                                <a className="dropdown-item">Search Logs</a>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item dropdown ml-auto">
                        <a className="nav-link dropdown-toggle" href="#" id="crawlerDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Crawler</a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                            <Link href="/crawler/dashboard">
                                <a className="dropdown-item">Dashboard</a>
                            </Link>
                            <Link href="/crawler/websites">
                                <a className="dropdown-item">Websites</a>
                            </Link>
                            <Link href="/crawler/webpages">
                                <a className="dropdown-item">Webpages</a>
                            </Link>
                            <Link href="/crawler/webmedias">
                                <a className="dropdown-item">Webmedias</a>
                            </Link>
                        </div>
                    </li>
                    <li className="nav-item dropdown ml-auto">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> My Account</a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                            <Link href="/account/profile">
                                <a className="dropdown-item" href="#">Profile</a>
                            </Link>
                            <Link href="/account/changePassword">
                                <a className="dropdown-item" href="#">Change Password</a>
                            </Link>
                            <a className="dropdown-item" href="#" onClick={() => { this.logout() }}>Logout</a>
                        </div>
                    </li>
                </React.Fragment>
        } else {
            accountSection =
                <React.Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => { this.login() }}>Login</a>
                    </li>
                </React.Fragment>
        }

        return accountSection;
    }
}

export default AccountMenu;