import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import LabelControl from '../../components/labelControlComponent'
import IconControl from '../../components/iconControlComponent';
import {config} from '../../config';

export default class WebsiteDetailsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: true
        };

        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        var websiteId = this.props.match.params.websiteId;
        this.setState({ websiteId: websiteId });

        var websiteDetailsApiEndpoint = appConfig.apiBaseUrl + 'website/' + websiteId;
        axios.get(websiteDetailsApiEndpoint)
            .then(apiResult => {
                if (apiResult.data) {

                    this.setState({
                        website: apiResult.data,
                        isBusy: false
                    });
                }
            })
            .catch(error => alert(error));
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Website");
        if (r == true) {
            var websiteDeleteApiEndpoint = appConfig.apiBaseUrl + 'website/' + this.state.websiteId;
            axios.delete(websiteDeleteApiEndpoint)
                .then(apiResult => {
                    toast("Website deleted Successfully");
                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    render() {
        let content;

        if (this.state.isBusy) {
            content = <div>Loading Website Details</div>;
        }
        else {
            content = <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/website">Websites</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Details</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <Link to={{ pathname: '/website/' + this.state.websiteId + '/edit' }} className="btn btn-primary">Edit</Link>
                                <a role="button" className="btn btn-danger mr-2" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <h1 className="my-4">
                        {this.state.website.name}<span className="badge badge-success ml-3">{this.state.website.rating}</span>
                    </h1>
                    <div className="row">
                        <div className="col-md-8">
                            <h3 className="my-3">About</h3>
                            <p>{this.state.website.about}</p>
                        </div>
                        <div className="col-md-4">
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}