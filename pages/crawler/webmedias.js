import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';

class Webmedias extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: {
                currentPage: 1,
                hasNextPage: true
            },
            data: [],
            isBusy: true
        };

        this.loadNextPage = this.loadNextPage.bind(this);
    }

    componentDidMount() {
        var websitesApiEndpoint = config.robotsApiBaseUrl + 'webmedias/manage?page=' + this.state.pagingInfo.currentPage;
        axios.get(websitesApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                this.setState({
                    data: apiResult.data.items,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    loadNextPage() {
        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var websitesNextPageApiEndpoint = config.robotsApiBaseUrl + 'webmedias/manage?page=' + nextPage;
        axios.get(websitesNextPageApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                var data = that.state.data;
                var newData = data.concat(apiResult.data.items);
                this.setState({
                    data: newData,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    render() {
        let loadMore = <button className="btn btn-primary" onClick={this.loadNextPage}>Load More</button>;

        const websitesList = this.state.data.map((website, index) => {
            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={website.id}>
                    <div className="card">
                        <div className="card-labels">
                            <span className="ratingBadge">{website.Rating}</span>
                        </div>
                        <a href={{ pathname: '/website/' + website.id }}>
                            <img className="card-img-top" src={website.url} alt={website.name} />
                        </a>
                        <div className="card-body">
                            <h5 className="card-title">{website.url}</h5>
                        </div>
                    </div>
                </div>);
        });
        let content;

        if (this.state.isBusy) {
            content = <div>Loading Webmedias</div>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href="/crawler/dashboard">Crawler</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Webmedias</li>
                    </ol>
                </nav>
                <h1>Manage Webmedias</h1>
                <div className="col-md">
                    <div className="d-flex justify-content-end">
                        <a href="/website/new" className="btn btn-primary mb-2">Create</a>
                    </div>
                </div>
                <div className="row">
                    {websitesList}
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

export default privateRoute(Webmedias);