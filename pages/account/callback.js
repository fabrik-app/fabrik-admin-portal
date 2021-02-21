import React, { Component } from 'react';
import Router from 'next/router';
import Oidc from 'oidc-client';
import EventManager from '../../services/eventManager';
import Cookie from "js-cookie";

class CallBack extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "Logged in Successfully, Redirecting back to main page"
        }

        if (typeof window !== 'undefined') {
            var that = this;
            this.usermanger = new Oidc.UserManager({ response_mode: "query" }).signinRedirectCallback().then(function (user) {
                if (user) {
                    
                    const token  = user.access_token;
                    Cookie.set("fabrik.authToken", token);

                    var orignalRoute = user.state;
                    that.setState({
                        message: "Logged in Successfully, Redirecting back to main page"
                    }, () => {
                        EventManager.publish('loggedIn', user);
                        if(orignalRoute){
                            Router.push(orignalRoute);
                        }
                        else{
                            Router.push('/');
                        }
                    });
                }
            }).catch(function (e) {
                that.setState({
                    message: "Login failed, Please try again or contact Support"
                }, () => {
                    alert("Login failed, Please try again or contact Support");
                    Router.push('/');
                });
            });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="h-100 d-flex justify-content-center align-items-center">
                    <h3 className="my-5">{this.state.message}</h3>
                </div>
            </div>
        );
    }
}

export default CallBack;