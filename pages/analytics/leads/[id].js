import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../../../config';
import Moment from 'react-moment';
import LoadMoreButton from '../../../components/loadmoreButtonComponent';
import { privateRoute } from '../../../privateRoute';
import BusyIndicator from '../../../components/busyIndicator';

class LeadActivity extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            data: props.data,
            pagingInfo: props.pagingInfo,
            sort: "updated",
            isBusy: false,
            isLoading: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    static async getInitialProps(props) {

        var dataApiEndpoint = config.apiBaseUrl + 'analytics/leads/' + props.query.id;
        const apiResult = await axios.get(dataApiEndpoint, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            id: props.query.id,
            data: apiResult.data.items,
            pagingInfo: apiResult.data.pagingInfo
        };
    }

    handleSortChange(e) {
        var that = this;
        var thatVal = e.target.value;
        this.setState({
            sort: thatVal
        }, () => {
            that.loadPage();
        });
    }

    loadPage() {
        var that = this;
        this.setState({
            isBusy: true
        }, () => {
            var dataApiEndpoint = config.apiBaseUrl + 'analytics/leads/' + this.props.id + '?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
            axios.get(dataApiEndpoint, {
                headers: { Authorization: `Bearer ${that.props.auth.token}` }
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
        var that = this;
        this.state.isLoading = true;

        var nextPage = this.state.pagingInfo.currentPage + 1;
        var dataApiNextPageEndpoint = config.apiBaseUrl + 'analytics/leads/' + this.props.id + '?page=' + nextPage + '&sort=' + this.state.sort;
        axios.get(dataApiNextPageEndpoint, {
            headers: { Authorization: `Bearer ${that.props.auth.token}` }
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

        const entityViewsList = this.state.data.map((entityView, index) => {
            return (
                <tr key={index}>
                    <td>{entityView.entityInfo.name}</td>
                    <td>{entityView.deviceInfo.name}</td>
                    <td>{entityView.city}</td>
                    <td>{entityView.ipAddress}</td>
                    <td><Moment fromNow>{entityView.eventTime}</Moment></td>
                </tr>);
        });

        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Views"/>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item">Analytics</li>
                        <li className="breadcrumb-item active" aria-current="page"><Link href={{ pathname: '/lead/' + this.props.id }}><a>Lead</a></Link></li>
                    </ol>
                </nav>
                <h1>Views</h1>
                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Page</th>
                                <th scope="col">Device</th>
                                <th scope="col">City</th>
                                <th scope="col">IP Address</th>
                                <th scope="col">Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entityViewsList}
                        </tbody>
                    </table>
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

export default privateRoute(LeadActivity);