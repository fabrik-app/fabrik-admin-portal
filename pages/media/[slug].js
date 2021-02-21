import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../../config';
import LabelControl from '../../components/labelControlComponent';
import { privateRoute } from '../../privateRoute';
import BusyIndicator from '../../components/busyIndicator';

class MediaDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            data: props.data
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateAlt = this.updateAlt.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    static async getInitialProps(props) {

        var dataApiEndpoint = config.apiBaseUrl + 'medias/' + props.query.slug;

        const apiResult = await axios.get(dataApiEndpoint, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            data: apiResult.data
        }
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    updateAlt() {
        var apiUrl = config.apiBaseUrl + 'medias/' + this.props.data.id + '/alt';

        var payload = {
            alt: this.state.altTag
        };

        axios.put(apiUrl, payload, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                alert("Alt Tag updated Successfully");
                this.setState({
                    pageUrl: ""
                });
            })
            .catch(error => alert(error));
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Media");
        if (r == true) {
            var deleteDataApiEndpoint = config.apiBaseUrl + 'medias/' + this.state.data.id;
            axios.delete(deleteDataApiEndpoint, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    alert("Media deleted Successfully");
                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    render() {

        let content;
        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Media details" />;
        }
        else {
            const primaryImage = "https://fabrik.sgp1.digitaloceanspaces.com/images/" + this.state.data.name;
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/medias"><a>Medias</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.state.data.name}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <a role="button" className="btn btn-primary" data-toggle="modal" data-target="#altTagUpdate"> Edit Alt</a>
                                <a role="button" className="btn btn-danger" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="media">
                                <img src={primaryImage} className="media-large" alt={this.props.name} />
                            </div>
                        </div>
                        <div className="col-md-4">
                        <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Store</h5>
                                    <div className="card-text">
                                    <Link href={'/store/' + this.props.data.store.slug}>
                                        <a>
                                            <p>{this.props.data.store.name}</p>
                                        </a>
                                    </Link>
                                    <Link href={this.props.data.metaInfo.source.url}>
                                        <a target="_blank">
                                            <i className="fas fa-external-link-alt"></i> View
                                        </a>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Stats</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Views"><i className="far fa-eye" /> {this.props.data.views}</li>
                                            <li title="Likes"><i className="far fa-heart" />&nbsp; {this.props.data.likes}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Meta</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Width"><i class="fas fa-ruler-horizontal"/> <LabelControl value={this.props.data.metaInfo.width} /> px</li>
                                            <li title="Height"><i class="fas fa-ruler-vertical"/> &nbsp; &nbsp;<LabelControl value={this.props.data.metaInfo.height} /> px</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="altTagUpdate" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Alt Tag</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Alt Tag</label>
                                        <input type="text" className="form-control" placeholder="Enter alt" name="altTag" value={this.state.altTag} onChange={this.handleInputChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.updateAlt} data-dismiss="modal">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}

export default privateRoute(MediaDetails);