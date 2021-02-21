import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import LoadMoreButton from '../components/loadmoreButtonComponent';
import { privateRoute } from '../privateRoute';
import IconControl from '../components/iconControlComponent';
import BusyIndicator from '../components/busyIndicator';

class Stores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: props.pagingInfo,
            data: props.data,
            sort: props.sort,
            publishedState: "all",
            selectedCity: ''
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handlePublishedStateChange = this.handlePublishedStateChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'stores?sort=latest&state=all' ;
        var citiesApiUrl = config.apiBaseUrl + 'cities/all';

        const [apiResult, cities] = await Promise.all([
            axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${props.auth.token}` }
            }),
            axios.get(citiesApiUrl, {
                headers: { Authorization: `Bearer ${props.auth.token}` }
            })
        ]);

        return {
            auth: props.auth,
            sort: "latest",
            cities: cities.data,
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

    handlePublishedStateChange(e) {
        var that = this;
        var thatVal = e.target.value;
        this.setState({
            publishedState: thatVal,
            pagingInfo: {
                currentPage: 1
            }
        }, () => {
            that.loadPage();
        });
    }

    handleCityChange(e) {
        var that = this;
        var thatVal = e.target.value;
        this.setState({
            selectedCity: thatVal,
            pagingInfo: {
                currentPage: 1
            }
        }, () => {
            that.loadPage();
        });
    }

    loadPage() {
        var that = this;
        this.setState({
            isBusy: true
        }, () => {
            var apiEndpoint = config.apiBaseUrl + 'stores?page=' + that.state.pagingInfo.currentPage + '&sort=' + that.state.sort + '&state=' + that.state.publishedState;
            
            if(this.state.selectedCity){
                apiEndpoint = apiEndpoint + '&city=' + this.state.selectedCity;
            }

            axios.get(apiEndpoint, {
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

        that.state.isLoading = true;

        var nextPage = this.state.pagingInfo.currentPage + 1;
        var apiEndpoint = config.apiBaseUrl + 'stores?page=' + nextPage + '&sort=' + that.state.sort + '&state=' + that.state.publishedState;
        
        if(this.state.selectedCity){
            apiEndpoint = apiEndpoint + '&city=' + this.state.selectedCity;
        }

        axios.get(apiEndpoint, {
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

        const storesList = this.state.data.map((store, index) => {
            var primaryImage;
            if (store.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/" + config.fileRootUrl + "/" + config.imageFolder + "/" + store.primaryImage;
            } else {
                primaryImage = "https://dummyimage.com/400x400/563d7c/ffffff&text=" + store.name;
            }
            return (
                <div className="col-sm-12 col-lg-3 mt-5" key={index}>
                    <div className="card">
                        <div className="card-labels">
                            <span className="ratingBadge">{store.Rating}</span>
                        </div>
                        <Link href={'/store/' + store.slug}>
                            <a>
                                <img className="card-img-top" src={primaryImage} alt={store.name} />
                            </a>
                        </Link>
                        <div className="card-body">
                            <h6 className="card-title">{store.name}</h6>
                            <div data-toggle="tooltip" data-placement="left" title={store.website}>
                                <IconControl value={store.website} icon="fas fa-globe" />
                            </div>
                            <p className="text-muted">{store.isActive? 'Published': 'Not Published'}</p>
                        </div>
                    </div>
                </div>
            );
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading all Stores" />;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page"><a>Stores</a></li>
                    </ol>
                </nav>
                <h1>Manage Stores</h1>
                <hr />
                <div className="row">
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select id="publishedState"
                                name="publishedState"
                                value={this.state.publishedState}
                                onChange={this.handlePublishedStateChange}
                                className="form-control">
                                <option>Please select Published State</option>
                                <option value="published">Published</option>
                                <option value="unpublished">UnPublished</option>
                                <option value="all">All</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select name="selectedCity"
                                id="selectedCity"
                                value={this.state.selectedCity}
                                onChange={this.handleCityChange}
                                className="form-control">
                                <option value="">Select City</option>
                                {this.props.cities.map(function (city, i) {
                                    return (
                                        <option value={city.name} key={i}>{city.name}</option>
                                    )
                                })}
                        </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select id="sort"
                                name="sort"
                                value={this.state.sort}
                                onChange={this.handleSortChange}
                                className="form-control">
                                <option>Please select Sort</option>
                                <option value="latest">Latest</option>
                                <option value="rating">Rating</option>
                                <option value="views">Views</option>
                                <option value="name">Name</option>
                                <option value="updated">Last Updated</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex justify-content-end">
                            <a href="/store/new" className="btn btn-primary mb-2">Create</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {storesList}
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

export default privateRoute(Stores);