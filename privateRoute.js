import ServerCookie from "next-cookies";
import { Component } from "react";
import { AuthToken } from "./services/auth_token";

export function privateRoute(WrappedComponent) {

    return class extends Component {
        static async getInitialProps(ctx) {
            const token = ServerCookie(ctx)["fabrik.authToken"];
            const auth = new AuthToken(token);
            const initialProps = { 
                auth: auth,
                query: ctx.query
             };
            if (auth.isExpired) {
                ctx.res.writeHead(302, {
                    Location: "/account/login?redirected=true",
                }); ctx
                ctx.res.end();
            }
            if (WrappedComponent.getInitialProps)
                return WrappedComponent.getInitialProps(initialProps);

            return initialProps;
        }
 
        get auth() {
            return new AuthToken(this.props.auth.token);
        }

        render() {
            return <WrappedComponent auth={this.auth} {...this.props} />;
        }
    };
}