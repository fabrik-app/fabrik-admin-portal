import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../../config';
import {privateRoute} from '../../privateRoute';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: {
                totalWebsites: 0,
                totalWebPages: 0,
                totalMediaItems: 0
            }
        };
    }

    componentDidMount() {
        this.setState({ isBusy: true });
        var apiEndpoint = config.robotsApiBaseUrl + 'reports/stats';
        axios.get(apiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                if (apiResult.data) {

                    this.setState({
                        stats: apiResult.data,
                        isBusy: false
                    });
                }
            })
            .catch(error => alert(error));
    }

    render() {
        return (
            <div className="container py-5 my-5">
                <div className="row">
                    <br />
                    <div className="col text-center">
                        <h2>Crawler Dashboard</h2>
                        <p>Manage your Fabrik crawler here</p>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <Link href="/crawler/websites">
                            <div className="counter">
                                <i className="fas fa-store fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalWebsites}</h2>
                                <p className="count-text ">Websites</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/crawler/webpages">
                            <div className="counter">
                                <i className="fas fa-user-tag fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalWebPages}</h2>
                                <p className="count-text ">Webpages</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/crawler/webmedias">
                            <div className="counter">
                                <i className="fas fa-tags fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalMediaItems}</h2>
                                <p className="count-text ">Media Items</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default privateRoute(Dashboard);