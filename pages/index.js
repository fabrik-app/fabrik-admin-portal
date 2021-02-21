import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../config';
import {privateRoute} from '../privateRoute';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: {
                totalStores: 0,
                totalDesigners: 0,
                totalProducts: 0,
                totalWebsites: 0,
                totalMediaItems: 0,
                totalPosts: 0,
                totalUsers: 0,
                totalLeads: 0,
                totalCities: 0,
                totalSearches: 0
            }
        };
    }

    componentDidMount() {
        this.setState({ isBusy: true });
        var apiEndpoint = config.apiBaseUrl + 'reports/stats';
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
                        <h2>Welcome to Fabrik Admin</h2>
                        <p>Manage your Fabrik assets from here</p>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col">
                        <Link href="/stores">
                            <div className="counter">
                                <i className="fas fa-store fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalStores}</h2>
                                <p className="count-text ">Stores</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/designers">
                            <div className="counter">
                                <i className="fas fa-user-tag fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalDesigners}</h2>
                                <p className="count-text ">Designers</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/products">
                            <div className="counter">
                                <i className="fas fa-tags fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalProducts}</h2>
                                <p className="count-text ">Products</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/medias">
                            <div className="counter">
                                <i className="far fa-images fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalMediaItems}</h2>
                                <p className="count-text ">Media Items</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <br/>
                <div className="row text-center">
                    <div className="col">
                        <Link href="/posts">
                            <div className="counter">
                                <i className="fas fa-users fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalPosts}</h2>
                                <p className="count-text ">Posts</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/users">
                            <div className="counter">
                                <i className="fas fa-users fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalUsers}</h2>
                                <p className="count-text ">Users</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/leads">
                            <div className="counter">
                                <i className="fas fa-users fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalLeads}</h2>
                                <p className="count-text ">Leads</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col">
                        <Link href="/analytics/searchlogs">
                            <div className="counter">
                                <i className="fas fa-search fa-2x" />
                                <h2 className="timer count-title count-number">{this.state.stats.totalSearches}</h2>
                                <p className="count-text ">Search Logs</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default privateRoute(Dashboard);