import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../config';
import moment from 'moment';
import DateTime from 'react-datetime';

export default class AddEditWebsiteComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: true,
            pageTitle: "Create new Website",
            website: {
                id: null,
                name: "",
                about: ""
            }
        };  

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
    }

    componentDidMount() {
        if (this.props.match.url != '/website/new') {
            var websiteId = this.props.match.params.websiteId;
            this.setState({ id: websiteId, pageTitle: "Update Website" });

            var apiEndpoint = appConfig.apiBaseUrl + 'website/' + websiteId;
            axios.get(apiEndpoint)
                .then(apiResult => {

                    this.setState({
                        website: apiResult.data,
                        isBusy: false
                    });
                })
                .catch(error => alert(error));
        }
        else {
            this.setState({ isBusy: false });
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

        if (this.state.website.id == null) {
            var createWebsiteUrl = appConfig.apiBaseUrl + 'website/new';
            axios.post(createWebsiteUrl, this.state.website)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Website created Successfully");

                    window.history.back();
                })
                .catch(error => alert(error));
        }
        else {
            var updateWebsiteUrl = appConfig.apiBaseUrl + 'website/' + this.state.website.id;
            axios.put(updateWebsiteUrl, this.state.website)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Website updated Successfully");

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
                <h1>{this.state.pageTitle}</h1>
                <form role="form" onSubmit={this.handleSubmit}>
                    <div asp-validation-summary="All" className="text-danger" />
                    <div className="container">
                        <h4>Primary Details</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Name</label>
                                <input className="form-control"
                                    id="name"
                                    name="website.name"
                                    value={this.state.website.name}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Description</label>
                                <textarea id="description"
                                    name="website.description"
                                    className="form-control"
                                    value={this.state.website.description}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Store Id</label>
                                <input className="form-control"
                                    id="name"
                                    name="website.storeId"
                                    value={this.state.website.storeId}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Domain</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label>Sub Domain</label>
                                <input id="subDomain"
                                    name="website.subDomain"
                                    value={this.state.website.subDomain}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Domain</label>
                                <input id="domain"
                                    name="website.domain"
                                    value={this.state.website.domain}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Other Details</h4>
                        <hr />
                        <div className="form-group">
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="isActive"
                                    name="website.isActive"
                                    checked={this.state.website.isActive}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Is Active
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="hasBlog"
                                    name="website.hasBlog"
                                    checked={this.state.website.hasBlog}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Has Blog
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="anyoneCanRegister"
                                    name="website.anyoneCanRegister"
                                    checked={this.state.website.anyoneCanRegister}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Anyone Can Register
                                </label>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" >Save</button>
                </form>
            </div>;
        }

        return content;
    }
}