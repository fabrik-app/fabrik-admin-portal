import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../../config';
import { privateRoute } from '../../../privateRoute';

class AddTemplate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pageTitle: "Create new Template",
            data: {
                id: null,
                type: "",
                name: "",
                content: "",
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

    handleSubmit(event) {

        event.preventDefault();

        this.setState({
            isBusy: true
        });

        var apiUrl = config.apiBaseUrl + 'templates';
        axios.post(apiUrl, this.state.data, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {

                this.setState({
                    isBusy: false
                });

                alert("Template created Successfully");

                window.history.back();
            })
            .catch(error => alert(error));
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Template Details</div>;
        }
        else {
            content = <div className="container">
                <h1>{this.state.pageTitle}</h1>
                <form role="form" onSubmit={this.handleSubmit}>
                    <div asp-validation-summary="All" className="text-danger" />
                    <div className="container">
                        <h4>Primary Details</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Type</label>
                                <select id="type"
                                    name="data.type"
                                    value={this.state.data.type}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select Type</option>
                                    <option value="Email">Email</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Name</label>
                                <input className="form-control"
                                    id="name"
                                    name="data.name"
                                    value={this.state.data.name}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Title</label>
                                <input className="form-control"
                                    id="title"
                                    name="data.title"
                                    value={this.state.data.title}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Content</label>
                                <textarea id="content"
                                    name="data.content"
                                    className="form-control"
                                    value={this.state.data.content}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
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

export default privateRoute(AddTemplate);