import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../../../config';
import moment from 'moment';
import DateTime from 'react-datetime';
import { privateRoute } from '../../../privateRoute';

class EditDesigner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pageTitle: props.designer.name,
            designer: props.designer,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
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

    handleInputChange(e) {
        const names = e.target.name.split(".");
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

        this.setState((state) => {
            if (names.length == 2) {
                this.state[names[0]][names[1]] = value;
                return { [names[0]]: this.state[names[0]] };
            }
            else if (names.length == 3) {
                this.state[names[0]][names[1]][names[2]] = value;
                return { [names[0]]: this.state[names[0]] };
            }
            else {
                this.state[names[0]] = value;
                return { [names[0]]: this.state[names[0]] };
            }
        });
    }

    handleTelephoneNumber(e) {
        var currentValue = e.target.value;
        e.target.value = currentValue.replace(/[^+\d]+/g, "");
        this.handleInputChange(e);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            isBusy: true
        });

        var createDesignerApiEndpoint = config.apiBaseUrl + 'designers/' + this.state.designer.id;
        axios.put(createDesignerApiEndpoint, this.state.designer, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {

                this.setState({
                    isBusy: false
                });

                alert("Designer updated Successfully");

                window.history.back();
            })
            .catch(error => alert(error));
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Designer Details</div>;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href="/designers">Designers</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Update</li>
                    </ol>
                </nav>
                <h1>{this.state.pageTitle}</h1>
                <form role="form" onSubmit={this.handleSubmit} className="mb-5">
                    <div asp-validation-summary="All" className="text-danger" />
                    <div className="container">
                        <h4>Primary Details</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Name</label>
                                <input className="form-control"
                                    id="name"
                                    name="designer.name"
                                    value={this.state.designer.name}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Rating</label>
                                <input type="number"
                                    min={0}
                                    max={5}
                                    step="0.1"
                                    id="rating"
                                    name="designer.rating"
                                    value={this.state.designer.rating}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>About</label>
                                <textarea id="description"
                                    name="designer.about"
                                    className="form-control"
                                    value={this.state.designer.about}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Contact</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label>Landline</label>
                                <input id="landline"
                                    name="designer.landline"
                                    value={this.state.designer.landline}
                                    onChange={this.handleTelephoneNumber}
                                    className="form-control phoneNumber" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Mobile</label>
                                <input id="mobile"
                                    name="designer.mobile"
                                    value={this.state.designer.mobile}
                                    onChange={this.handleTelephoneNumber}
                                    className="form-control phoneNumber" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Whatsapp</label>
                                <input id="whatsapp"
                                    name="designer.whatsapp"
                                    value={this.state.designer.whatsapp}
                                    onChange={this.handleTelephoneNumber}
                                    className="form-control phoneNumber" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Email</label>
                                <input id="email"
                                    name="designer.email"
                                    value={this.state.designer.email}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="container">
                        <h4>Social Media</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Facebook</label>
                                <input type="url" id="facebook"
                                    name="designer.social.facebook"
                                    value={this.state.designer.social.facebook}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Twitter</label>
                                <input type="url" id="twitter"
                                    name="designer.social.twitter"
                                    value={this.state.designer.social.twitter}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Google Plus</label>
                                <input type="url" id="googlePlus"
                                    name="designer.social.googlePlus"
                                    value={this.state.designer.social.googlePlus}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>LinkedIn</label>
                                <input type="url" id="linkedIn"
                                    name="designer.social.linkedIn"
                                    value={this.state.designer.social.linkedIn}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-4">
                                <label>YouTube</label>
                                <input type="url" id="youTube"
                                    name="designer.social.youTube"
                                    value={this.state.designer.social.youTube}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Instagram</label>
                                <input type="url"
                                    id="instagram"
                                    name="designer.social.instagram"
                                    value={this.state.designer.social.instagram}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Pinterest</label>
                                <input type="url" id="pinterest"
                                    name="designer.social.pinterest"
                                    value={this.state.designer.social.pinterest}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                    </div> */}
                    <div className="container">
                        <h4>SEO</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Slug</label>
                                <input id="slug"
                                    name="designer.slug"
                                    value={this.state.designer.slug}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Title</label>
                                <input id="sEO.Title"
                                    name="designer.seo.title"
                                    value={this.state.designer.seo.title}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Description</label>
                                <textarea id="sEO.Description"
                                    name="designer.seo.description"
                                    value={this.state.designer.seo.description}
                                    onChange={this.handleInputChange}
                                    className="form-control"
                                    rows={4}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Meta Keywords</label>
                                <textarea id="sEO.Keywords"
                                    name="designer.seo.keywords"
                                    className="form-control"
                                    value={this.state.designer.seo.keywords}
                                    onChange={this.handleInputChange}
                                    rows={4} />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Other Details</h4>
                        <hr />
                        <div className="form-group">
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="isVerified"
                                    name="designer.isVerified"
                                    checked={this.state.designer.isVerified}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Is Verified
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox"
                                    name="designer.isActive"
                                    checked={this.state.designer.isActive}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label" id="isActive" name="isActive">
                                    Is Active
                                </label>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" >Save</button>
                </form>
            </div>;
        }

        return content;
    }
}

export default privateRoute(EditDesigner);