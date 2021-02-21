import * as React from 'react';
import Link from "next/link";
import axios from 'axios';
import LabelControl from '../../components/labelControlComponent';
import IconControl from '../../components/iconControlComponent';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';

class DesignerDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            designer: props.designer,
        };

        this.removeItem = this.removeItem.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'designers/' + props.query.slug;

        const selectedDesigner = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });


        return {
            auth: props.auth,
            designer: selectedDesigner.data
        }
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Designer");
        if (r == true) {
            var designerDeleteApiEndpoint = config.apiBaseUrl + 'designers/' + this.state.designer.id;
            axios.delete(designerDeleteApiEndpoint, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    alert("Designer deleted Successfully");
                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    SocialCard(social) {
        let content;
        if (social) {
            content =
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Web &amp; Social</h5>
                        <div className="card-text">
                            <ul className="list-inline">
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Website">
                                    <IconControl value={social.website} icon="fas fa-globe fa-2x" />
                                </li>
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Facebook">
                                    <IconControl value={social.facebook} icon="fab fa-facebook fa-2x" />
                                </li>
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Twitter">
                                    <IconControl value={social.twitter} icon="fab fa-twitter fa-2x" />
                                </li>
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Youtube">
                                    <IconControl value={social.youTube} icon="fab fa-youtube fa-2x" />
                                </li>
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Instagram">
                                    <IconControl value={social.instagram} icon="fab fa-instagram fa-2x" />
                                </li>
                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Pinterest">
                                    <IconControl value={social.pinterest} icon="fab fa-pinterest fa-2x" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
        }

        return content;
    }

    render() {
        let content;

        if (this.state.isBusy) {
            content = <div>Loading Designer Details</div>;
        }
        else {
            let fabrikUrl = "https://fabrik.in/designer/" + this.state.designer.slug;
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/designers"><a>Designers</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page"><a>{this.state.designer.name}</a></li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <a role="button" className="btn btn-primary" target="_blank" href={fabrikUrl}><i className="fas fa-external-link-alt"></i> View</a>
                                <Link href={{ pathname: '/analytics/designer/' + this.state.designer.id, search: '?name=' + encodeURIComponent(this.state.designer.name) }}>
                                    <a role="button" className="btn btn-primary"> Analytics</a>
                                </Link>
                                <Link href={{ pathname: '/designer/' + this.state.designer.id + '/media' }}>
                                    <a role="button" className="btn btn-primary"> Media</a>
                                </Link>
                                <Link href={{ pathname: '/designer/' + this.state.designer.slug + '/edit' }}>
                                    <a role="button" className="btn btn-primary"> Edit</a>
                                </Link>
                                <a role="button" className="btn btn-danger mr-2" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <h1 className="my-4">
                        {this.state.designer.name}<span className="badge badge-success ml-3">{this.state.designer.rating}</span>
                    </h1>
                    <div className="row">
                        <div className="col-md-8">
                            <h3 className="my-3">About</h3>
                            <p>{this.state.designer.about}</p>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Stats</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Views"><i className="far fa-eye" /> <LabelControl value={this.state.designer.views} /></li>
                                            <li title="Likes"><i className="fas fa-heart" /> <LabelControl value={this.state.designer.likes} /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Contact</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Landline"><i className="fas fa-phone" /> <LabelControl value={this.state.designer.landline} /></li>
                                            <li title="Mobile"><i className="fas fa-mobile" /> <LabelControl value={this.state.designer.mobile} /></li>
                                            <li title="Whatsapp"><i className="fab fa-whatsapp" /> <LabelControl value={this.state.designer.whatsapp} /></li>
                                            <li title="Email"><i className="far fa-envelope" /> <LabelControl value={this.state.designer.email} /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {this.SocialCard(this.state.designer.social)}
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}

export default privateRoute(DesignerDetails);
