import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../../config';
import Moment from 'react-moment';
import LoadMoreButton from '../../components/loadmoreButtonComponent';
import { privateRoute } from '../../privateRoute';
import BusyIndicator from '../../components/busyIndicator';

class SearchLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: props.pagingInfo,
            data: props.data,
            sort: props.sort,
            publishedState: "published"
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'search/logs?sort=latest&state=published' ;

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            sort: "latest",
            data: apiResult.data.items,
            pagingInfo: apiResult.data.pagingInfo
        }
    }

    handleSortChange(e) {
        var that = this;
        var thatVal = e.target.value;
        this.setState({
            sort: thatVal,
            pagingInfo: {
                currentPage: 1
            }
        }, () => {
            that.loadPage();
        });
    }

    loadPage() {
        this.setState({
            isBusy: true
        }, () => {
            var searchLogsApiEndpoint = config.apiBaseUrl + 'search/logs?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
            axios.get(searchLogsApiEndpoint, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    this.setState({
                        data: apiResult.data.items,
                        pagingInfo: apiResult.data.pagingInfo,
                        isBusy: false,
                        isLoading: false
                    });
                })
                .catch(error => {
                    this.setState({
                        isLoading: false
                    });

                    alert(error);
                });
        });
    }

    loadNextPage() {

        this.state.isLoading = true;

        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var searchLogsNextPageApiEndpoint = config.apiBaseUrl + 'search/logs?page=' + nextPage + '&sort=' + this.state.sort;
        axios.get(searchLogsNextPageApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                var previousList = that.state.data;
                var newList = previousList.concat(apiResult.data.items);
                this.setState({
                    data: newList,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false,
                    isLoading: false
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false
                });

                alert(error);
            });
    }

    render() {

        const searchlogsList = this.state.data.map((searchlog, index) => {
            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                    <div className="card">
                        <div className="card-body">
                            <a href={{ pathname: '/search/log/' + searchlog.id }}>
                                <h5 className="card-title">{searchlog.query}</h5>
                            </a>
                            <small><i className="fas fa-map-marker"></i> {searchlog.city}</small>
                            <br />
                            <small><i className="fas fa-user"></i> {searchlog.leadInfo.name}</small>
                            <br />
                            <small><Moment fromNow>{searchlog.createdOn}</Moment></small>
                            <h5 className="float-right"><span className="badge badge-success">{searchlog.source}</span></h5>
                        </div>
                    </div>
                </div>);
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Search Logs" />;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item">Analytics</li>
                        <li className="breadcrumb-item active" aria-current="page">Search Logs</li>
                    </ol>
                </nav>
                <h1>Search Logs</h1>
                <hr />
                <div className="row">
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select id="sort"
                                name="sort"
                                value={this.state.sort}
                                onChange={this.handleSortChange}
                                className="form-control">
                                <option>Please select Sort</option>
                                <option value="latest">Latest</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {searchlogsList}
                </div>
                <div className="row">
                    <div className="col-md mt-2">
                        <div className="d-flex justify-content-center">
                            <LoadMoreButton isLoading={this.state.isLoading} hasNextPage={this.state.pagingInfo.hasNextPage} loadMore={this.loadNextPage} />
                        </div>
                    </div>
                </div>
            </div>
        }

        return content;
    }
}

export default privateRoute(SearchLogs);