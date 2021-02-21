import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../config';

class AddCity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pageTitle: "Create new City",
            city: {
                id: null,
                country: "",
                state: "",
                district: "",
                parent: "",
                name: "",
                alias: "",
                zipCode: "",
                longitude: 90.0,
                latitude: 90.0
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

        var createCityUrl = config.apiBaseUrl + 'city/new';
        axios.post(createCityUrl, this.state.city)
            .then(apiResult => {

                this.setState({
                    isBusy: false
                });

                toast("City created Successfully");

                window.history.back();
            })
            .catch(error => alert(error));
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <div>Loading City Details</div>;
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
                                <label>Country</label>
                                <select id="country"
                                    name="city.country"
                                    value={this.state.city.country}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select Country</option>
                                    <option value="India">India</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>State</label>
                                <select id="state"
                                    name="city.state"
                                    value={this.state.city.state}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select State</option>
                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                                    <option value="Daman and Diu">Daman and Diu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Orissa">Orissa</option>
                                    <option value="Pondicherry">Pondicherry</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttaranchal">Uttaranchal</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="West Bengal">West Bengal</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>District</label>
                                <input className="form-control"
                                    id="district"
                                    name="city.district"
                                    value={this.state.city.district}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Parent</label>
                                <input className="form-control"
                                    id="parent"
                                    name="city.parent"
                                    value={this.state.city.parent}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Name</label>
                                <input className="form-control"
                                    id="name"
                                    name="city.name"
                                    value={this.state.city.name}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Alias</label>
                                <input className="form-control"
                                    id="alias"
                                    name="city.alias"
                                    value={this.state.city.alias}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>ZipCode</label>
                                <input className="form-control"
                                    id="zipCode"
                                    name="city.zipCode"
                                    value={this.state.city.zipCode}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Longitude</label>
                                <input className="form-control"
                                    id="city.longitude"
                                    name="city.longitude"
                                    type="number"
                                    min={-180}
                                    max={+180}
                                    step="0.0001"
                                    value={this.state.city.longitude}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Latitude</label>
                                <input className="form-control"
                                    id="city.latitude"
                                    name="city.latitude"
                                    type="number"
                                    min={-90}
                                    max={+90}
                                    step="0.0001"
                                    value={this.state.city.latitude}
                                    onChange={this.handleInputChange}
                                    />
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

export default AddCity;