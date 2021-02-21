import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import Moment from 'react-moment';
import LoadMoreButton from '../components/loadmoreButtonComponent';
import LabelControl from '../components/labelControlComponent';
import { privateRoute } from '../privateRoute';
import BusyIndicator from '../components/busyIndicator';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: props.pagingInfo,
            data: props.data,
            sort: props.sort
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'users?sort=latest' ;

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

    handleSourceChange(e) {
        var that = this;
        var thatVal = e.target.value;
        that.setState({
            source: thatVal,
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
            var usersApiEndpoint = config.apiBaseUrl + 'users?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort + '&source=' + this.state.source;
            axios.get(usersApiEndpoint, {
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

        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var usersNextPageApiEndpoint = config.apiBaseUrl + 'users?page=' + nextPage + '&sort=' + this.state.sort + '&source=' + this.state.source;
        axios.get(usersNextPageApiEndpoint, {
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

        const usersList = this.state.data.map((user, index) => {
            var primaryImage;
            if (user.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/https://propzchainprodstorage.blob.core.windows.net/media/" + user.primaryImage.blob;
            } else {
                primaryImage = "https://dummyimage.com/355x266/563d7c/ffffff&text=" + user.name;
            }

            var email, mobile;
            if (user.email) {
                email = user.email;
            }
            else {
                email = "Not Mentioned";
            }

            if (user.mobile) {
                mobile = user.mobile;
            }
            else {
                mobile = "Not Mentioned";
            }

            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <Link href={'/user/' + user.slug}>
                                    <a>
                                        <h5 className="card-title">{user.name}</h5>
                                    </a>
                                </Link>
                                <small><i className="far fa-envelope" /> {email}</small>
                                <br />
                                <small><i className="fas fa-mobile" /> {mobile}</small>
                                <br/>
                                <small><i className="fas fa-clock" /> <Moment fromNow>{user.createdOn}</Moment></small>
                                <h5 className="float-right"><span className="badge badge-success">{user.source}</span></h5>
                            </div>
                        </div>
                    </div>
            );
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Users" />;
        }
        else {

            content = <div className="container mb-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Users</li>
                    </ol>
                </nav>
                <h1>Manage Users</h1>
                <hr />
                <div className="row">
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select id="sort"
                                name="sort"
                                value={this.state.sort}
                                onChange={this.handleSortChange}
                                className="form-control">
                                <option value="">Please select Sort</option>
                                <option value="latest">Latest</option>
                                <option value="name">Name</option>
                                <option value="updated">Last Updated</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex justify-content-start">
                            <select id="source"
                                name="source"
                                value={this.state.source}
                                onChange={this.handleSourceChange}
                                className="form-control">
                                <option value="">Please select Source</option>
                                <option value="Web">Web</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3 offset-3">
                        <div className="d-flex justify-content-end">
                            <a href="/user/new" className="btn btn-primary mb-2">Create</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {usersList}
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

export default privateRoute(Users);