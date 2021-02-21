import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { config } from '../config';
import { privateRoute } from '../privateRoute';
import BusyIndicator from '../components/busyIndicator';

class Designers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pagingInfo: props.pagingInfo,
            data: props.data,
        };

        this.loadNextPage = this.loadNextPage.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'designers' ;

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            data: apiResult.data.items,
            pagingInfo: apiResult.data.pagingInfo
        }
    }

    loadNextPage() {
        var that = this;
        var nextPage = this.state.pagingInfo.currentPage + 1;
        var designersNextPageApiEndpoint = config.apiBaseUrl + 'designers/manage?page=' + nextPage;
        axios.get(designersNextPageApiEndpoint, {
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
        let loadMore = <button className="btn btn-primary" onClick={this.loadNextPage}>Load More</button>;

        const designersList = this.state.data.map((designer, index) => {
            var primaryImage;
            if (designer.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/" + config.fileRootUrl + "/" + config.imageFolder + "/" + designer.primaryImage;
            } else {
                primaryImage = "https://dummyimage.com/355x266/563d7c/ffffff&text=" + designer.name;
            }

            var city;
            if (designer.address) {
                city = designer.address.city;
            } else {
                city = "Not Specified";
            }

            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                    <div className="card">
                        <div className="card-labels">
                            <span className="ratingBadge">{designer.Rating}</span>
                        </div>
                        <Link href={'/designer/' + designer.slug}>
                            <a>
                                <img className="card-img-top" src={primaryImage} alt={designer.name} />
                            </a>
                        </Link>
                        <div className="card-body">
                            <h5 className="card-title">{designer.name}</h5>
                            <i className="fas fa-map-marker-alt"></i> {city}
                            <h5 className="float-right"><span className="badge badge-primary">{designer.rating}</span></h5>
                        </div>
                    </div>
                </div>
            );
        });
        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Designers" />;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page"><a>Designers</a></li>
                    </ol>
                </nav>
                <h1>Manage Designers</h1>
                <div className="col-md">
                    <div className="d-flex justify-content-end">
                        <a href="/designer/new" className="btn btn-primary mb-2">Create</a>
                    </div>
                </div>
                <div className="row">
                    {designersList}
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

export default privateRoute(Designers);