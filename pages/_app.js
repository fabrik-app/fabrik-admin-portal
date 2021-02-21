import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import { DefaultSeo } from 'next-seo';
import globalcss from "../styles/styles.global.scss";
import css from "../styles/styles.scss";
import TagManager from 'react-gtm-module';
import { hotjar } from 'react-hotjar';
import TopNavigation from '../components/topNavigation';
import Footer from '../components/footer';
import Router from 'next/router';
import { UserContext } from '../contexts/user-context';
import EventManager from '../services/eventManager';
import { config } from '../config';
import Oidc from 'oidc-client';
import NProgress from 'nprogress'; //nprogress module
import { ToastContainer, toast } from 'react-toastify';

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

if (typeof window !== "undefined") {
  require("jquery");
  require("popper.js");
  require("bootstrap");
}

const tagManagerArgs = {
  gtmId: 'tag0d'
}

class MyApp extends App {
  
  constructor(props) {
    super(props);

    this.state = {
      user: {
        isLoggedIn: false
      }
    };

    if (typeof window !== 'undefined') {
      var that = this;
      that.usermanger = new Oidc.UserManager(config.authConfig);
      that.usermanger.getUser().then(function (user) {
        if (user) {
          that.setState({
            user: {
              isLoggedIn: true,
              email: user.profile.email,
              name: user.profile.email,
              token: user.access_token
            }
          });
        }
      });
    }

    // Subscribe to app events.
    EventManager.subscribe('loggedIn', function(user) {
      if(user){
        that.setState({
          user: {
            isLoggedIn: true
          }
        });
      }
    });

    EventManager.subscribe('login', function() {
      if (typeof window !== 'undefined') {
        var usermanger = new Oidc.UserManager(config.authConfig);
        usermanger.signinRedirect({state: Router.asPath});
      }
    });

  }

  componentDidMount() {
    //TagManager.initialize(tagManagerArgs);
    //hotjar.initialize(1251475, 6);
    //Sentry.init({ dsn: "https://e378cc0c8f3e4930ace128021268ebc9@sentry.io/1425704" });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <React.Fragment>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta name="description" content="About Fabrik" />
          <meta name="author" content="Fabrik" />
          <meta name="generator" content="Fabrik" />
          <title>Fabrik Admin</title>
          <link rel='dns-prefetch' href='//fonts.googleapis.com' />
          <link rel='dns-prefetch' href='//browser.sentry-cdn.com' />
          <link rel='dns-prefetch' href='//imgs.fabrik.in' />
          <meta name="theme-color" content="#ffffff" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"></link>
        </Head>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: 'https://fabrik.in',
            site_name: 'Fabrik',
          }}
        />
         <UserContext.Provider value={this.state.user}>
          <div className="d-flex flex-column min-vh-100">
            <TopNavigation />
            <main className="flex-fill">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </UserContext.Provider>
        <ToastContainer />
      </React.Fragment>
    );
  }
}

export default MyApp;