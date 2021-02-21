import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import {config} from '../../config';
import Moment from 'react-moment';

export default class LeadEntityViews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: {
                currentPage: 1,
                hasNextPage: true
            },
            leadId: null,
            entity: 'lead',
            entityId: null,
            entityViews: [],
            sort: "updated",
            isBusy: true
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
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

    componentDidMount() {
        var entity = this.props.match.params.entity;
        var leadId = this.props.match.params.leadId;

        this.setState({
            entity: entity,
            leadId: leadId
        }, () => {
            this.loadPage();
        });
    }

    loadPage() {
        var leadEntityViewsApiEndpoint = appConfig.apiBaseUrl + 'analytics?entity=' + this.state.entity + '&leadId=' + this.state.leadId + '&page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
        axios.get(leadEntityViewsApiEndpoint)
            .then(apiResult => {
                this.setState({
                    entityViews: apiResult.data.items,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    loadNextPage() {
        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var leadEntityViewsNextPageApiEndpoint = appConfig.apiBaseUrl + 'analytics?entity=' + this.state.entity + '&leadId=' + this.state.leadId + '&page=' + nextPage + '&sort=' + this.state.sort;
        axios.get(leadEntityViewsNextPageApiEndpoint)
            .then(apiResult => {
                var previousList = that.state.entityViews;
                var newList = previousList.concat(apiResult.data.items);
                this.setState({
                    entityViews: newList,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    render() {

        //let query = this.useQuery();

        let loadMore = <button className="btn btn-primary" onClick={this.loadNextPage}>Load More</button>;

        const entityViewsList = this.state.entityViews.map((entityView, index) => {
            return (
                <tr>
                    <td>{entityView.entityInfo.name}</td>
                    <td>{entityView.deviceInfo.name}</td>
                    <td>{entityView.city}</td>
                    <td>{entityView.ipAddress}</td>
                    <td><Moment fromNow>{entityView.createdOn}</Moment></td>
                </tr>);
        });

        let entityLink;
        entityLink = <li className="breadcrumb-item"><Link to={{ pathname: '/lead/' + this.state.leadId }}></Link></li>

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Entity Views</div>;
        }
        else {

            content = <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/leads">Leads</Link></li>
                        {entityLink}
                        <li className="breadcrumb-item active" aria-current="page">Analytics</li>
                        <li className="breadcrumb-item"><Link to="/stores">Stores</Link></li>
                    </ol>
                </nav>
                <h1>Analytics</h1>
                <div className="row">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Store</th>
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
                            {this.state.pagingInfo.hasNextPage ? loadMore : null}
                        </div>
                    </div>
                </div>
            </div>
        }

        return content;
    }
}