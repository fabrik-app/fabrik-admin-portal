import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import { privateRoute } from '../privateRoute';
import BusyIndicator from '../components/busyIndicator';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: {
                currentPage: 1,
                hasNextPage: true
            },
            data: [],
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
        this.loadPage();
    }

    loadPage() {
        var productsApiEndpoint = config.apiBaseUrl + 'products?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
        axios.get(productsApiEndpoint,{
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
        var productsNextPageApiEndpoint = config.apiBaseUrl + 'products?page=' + nextPage + '&sort=' + this.state.sort;;
        axios.get(productsNextPageApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                var previousList = that.state.data;
                var newList = previousList.concat(apiResult.data.items);
                this.setState({
                    data: newList,
                    pagingInfo: apiResult.data.pagingInfo,
                    isBusy: false
                });
            })
            .catch(error => alert(error));
    }

    render() {
        let loadMore = <button className="btn btn-primary" onClick={this.loadNextPage}>Load More</button>;

        const productsList = this.state.data.map((product, index) => {
            var primaryImage;
            if (product.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/" + product.primaryImage.url;
            } else {
                primaryImage = "https://dummyimage.com/355x266/563d7c/ffffff&text=" + product.title;
            }
            return (

                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                    <div className="card">
                        <div className="card-labels">
                            <span className="ratingBadge">{product.Rating}</span>
                        </div>
                        {/* <Link to={{ pathname: '/product/' + product.id }}>
                            <img className="card-img-top" src={primaryImage} alt={product.title} />
                        </Link> */}
                        <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <h5 className="float-right"><span className="badge badge-primary">{product.rating}</span></h5>
                        </div>
                    </div>
                </div>);
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Products" />;
        }
        else {

            content = <div className="container">
                <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/products"><a>Products</a></Link></li>
                    </ol>
                </nav>
                    <h1>Manage Products</h1>
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
                                    <option value="rating">Rating</option>
                                    <option value="views">Views</option>
                                    <option value="name">Name</option>
                                    <option value="updated">Last Updated</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 offset-9">
                            <div className="d-flex justify-content-end">
                                {/* <Link to="/product/new" className="btn btn-primary mb-2">Create</Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {productsList}
                    </div>
                    <div className="row">
                        <div className="col-md mt-2">
                            <div className="d-flex justify-content-center">
                                {this.state.pagingInfo.hasNextPage ? loadMore : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        return content;
    }
}

export default privateRoute(Products);