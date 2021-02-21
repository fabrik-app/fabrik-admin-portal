import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import { privateRoute } from '../privateRoute';

class Websites extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: {
                currentPage: 1,
                hasNextPage: true
            },
            websites: [],
            isBusy: true
        };

        this.loadNextPage = this.loadNextPage.bind(this);
    }

    componentDidMount() {
        var websitesApiEndpoint = config.apiBaseUrl + 'websites/manage?page=' + this.state.pagingInfo.currentPage;
        axios.get(websitesApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                this.setState({
                    websites: apiResult.data.items,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    loadNextPage() {
        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var websitesNextPageApiEndpoint = config.apiBaseUrl + 'websites/manage?page=' + nextPage;
        axios.get(websitesNextPageApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                var previousList = that.state.websites;
                var newList = previousList.concat(apiResult.data.items);
                this.setState({
                    websites: newList,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    render() {
        let loadMore = <button className="btn btn-primary" onClick={this.loadNextPage}>Load More</button>;

        const websitesList = this.state.websites.map((website, index) => {
            var primaryImage;
            if (website.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/" + website.primaryImage.url;
            } else {
                primaryImage = "https://dummyimage.com/355x266/563d7c/ffffff&text=" + website.name;
            }

            var city;
            if (website.address) {
                city = website.address.city;
            } else {
                city = "Not Specified";
            }

            return (

                <div className="col-sm-12 col-lg-4 mt-5">
                    <div className="card">
                        <div className="card-labels">
                            <span className="ratingBadge">{website.Rating}</span>
                        </div>
                        <a href={{ pathname: '/website/' + website.id }}>
                            <img className="card-img-top" src={primaryImage} alt={website.name} />
                        </a>
                        <div className="card-body">
                            <h5 className="card-title">{website.name}</h5>
                            <i className="fas fa-map-marker-alt"></i> {city}
                            <h5 className="float-right"><span className="badge badge-primary">{website.rating}</span></h5>
                        </div>
                    </div>
                </div>);
        });
        let content;

        if (this.state.isBusy) {
            content = <div>Loading Websites</div>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Websites</li>
                    </ol>
                </nav>
                <h1>Manage Websites</h1>
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

export default privateRoute(Websites);