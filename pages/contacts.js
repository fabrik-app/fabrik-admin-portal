import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import LoadMoreButton from '../components/loadmoreButtonComponent';
import { privateRoute } from '../privateRoute';
import BusyIndicator from '../components/busyIndicator';

class Contacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pagingInfo: props.pagingInfo,
            data: props.data,
            sort: "updated",
            isBusy: true,
            isLoading: false
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'contacts';

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            data: apiResult.data.items,
            pagingInfo: apiResult.data.pagingInfo
        }
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
        this.setState({
            isBusy: true
        }, () => {
            var dataApiEndpoint = config.apiBaseUrl + 'contacts?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
            axios.get(dataApiEndpoint, {
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
        var dataApiNextPageEndpoint = config.apiBaseUrl + 'contacts?page=' + nextPage + '&sort=' + this.state.sort;
        axios.get(dataApiNextPageEndpoint)
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

        const list = this.state.data.map((contact, index) => {
            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                        <div className="card">
                            <div className="card-labels">
                                <span className="ratingBadge">{contact.Rating}</span>
                            </div>
                            <div className="card-body">
                                <Link href={'/contact/' + contact.slug}>
                                    <a>
                                    <h5 className="card-title">{contact.name}</h5>
                                    </a>
                                </Link>
                                
                                <h6 className="card-subtitle mb-2 text-muted"><b>Views -</b> {contact.views}</h6>
                                <h5 className="float-right"><span className="badge badge-primary">{contact.rating}</span></h5>
                            </div>
                        </div>
                    </div>
            );
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Contacts"/>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page"><a>Contacts</a></li>
                    </ol>
                </nav>
                <h1>Manage Contacts</h1>
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
                            <a href="/contact/new" className="btn btn-primary mb-2">Create</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {list}
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

export default privateRoute(Contacts);