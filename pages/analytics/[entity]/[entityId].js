import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../../../config';
import Moment from 'react-moment';
import LoadMoreButton from '../../../components/loadmoreButtonComponent';
import { privateRoute } from '../../../privateRoute';

class EntityViews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: {
                currentPage: 1,
                hasNextPage: true
            },
            entity: props.entity,
            entityId: props.entityId,
            entityViews: props.entityViewsResult.items,
            sort: "updated",
            isBusy: false,
            isLoading: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    static async getInitialProps(props) {

        var entityViewsApiEndpoint = config.apiBaseUrl + 'analytics?entity=' + props.query.entity + '&entityId=' + props.query.entityId;
        const entityViewsResult = await axios.get(entityViewsApiEndpoint, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            entity: props.query.entity,
            entityId: props.query.entityId,
            entitySlug: props.query.slug,
            entityName: props.query.name,
            entityViewsResult: entityViewsResult.data
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
            var entityViewsApiEndpoint = config.apiBaseUrl + 'analytics?entity=' + this.state.entity + '&entityId=' + this.state.entityId + '&page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
            axios.get(entityViewsApiEndpoint, {
                headers: { Authorization: `Bearer ${that.props.auth.token}` }
            })
            .then(apiResult => {
                this.setState({
                    entityViews: apiResult.data.items,
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
        var entityViewsNextPageApiEndpoint = config.apiBaseUrl + 'analytics?entity=' + this.state.entity + '&entityId=' + this.state.entityId + '&page=' + nextPage + '&sort=' + this.state.sort;
        axios.get(entityViewsNextPageApiEndpoint, {
            headers: { Authorization: `Bearer ${that.props.auth.token}` }
        })
        .then(apiResult => {
            var previousList = that.state.entityViews;
            var newList = previousList.concat(apiResult.data.items);
            this.setState({
                entityViews: newList,
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

        const entityViewsList = this.state.entityViews.map((entityView, index) => {
            return (
                <tr key={index}>
                    <td>{entityView.leadInfo.name}</td>
                    <td>{entityView.deviceInfo.name}</td>
                    <td>{entityView.city}</td>
                    <td>{entityView.ipAddress}</td>
                    <td><Moment fromNow>{entityView.eventTime}</Moment></td>
                </tr>);
        });

        let entityTypeLink;
        let entityLink;
        if (this.state.entity == "store") {
            entityTypeLink = <li className="breadcrumb-item"><Link href="/stores"><a>Stores</a></Link></li>
            entityLink =  <li className="breadcrumb-item"><Link href={'/' + this.props.entity + '/' + this.props.entitySlug}><a>{this.props.entityName}</a></Link></li>
        }
        else if (this.state.entity == "designer") {
            entityTypeLink = <li className="breadcrumb-item"><Link href="/designers"><a>Designers</a></Link></li>
            entityLink =  <li className="breadcrumb-item"><Link href={'/' + this.props.entity + '/' + this.props.entitySlug}><a>{this.props.entityName}</a></Link></li>
        }

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Entity Views</div>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        {entityTypeLink}
                        {entityLink}
                        <li className="breadcrumb-item active" aria-current="page">Analytics</li>
                    </ol>
                </nav>
                <h1>Views</h1>
                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Lead Name</th>
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

export default privateRoute(EntityViews);