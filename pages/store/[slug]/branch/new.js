import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../../../../config';
import moment from 'moment';
import DateTime from 'react-datetime';
import { privateRoute } from '../../../../privateRoute';
import BusyIndicator from '../../../../components/busyIndicator';
import NotificationManager from '../../../../services/notificationManager';

class AddStoreBranch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            data: {
                id: null,
                name: "",
                address: {
                    pinCode: "",
                    locality: "",
                    state: "Kerala",
                    country: "India"
                }
            },
            contactNumbers: [{
                type: "mobile",
                number: ""
            }],
            workingHours: [{
                day: "Sunday",
                state: "Is Closed",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Monday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Tuesday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Wednesday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Thursday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Friday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }, {
                day: "Saturday",
                state: "Specific Timings",
                start: "09:00",
                end: "18:00"
            }]
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
        this.onRemoveContactNumber = this.onRemoveContactNumber.bind(this);
        this.onAddContactNumber = this.onAddContactNumber.bind(this);
        this.handleContactNumberChanged = this.handleContactNumberChanged.bind(this);
        this.handleWorkingHourChanged = this.handleWorkingHourChanged.bind(this);
    }

    static async getInitialProps(props) {

        return {
            auth: props.auth,
            storeSlug: props.query.slug,
            storeName: props.query.name,
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

    onAddContactNumber() {

        const updatedList = [...this.state.contactNumbers, {
            type: "mobile",
            number: ""
        }];

        this.setState({
            contactNumbers: updatedList
        });
    }

    onRemoveContactNumber(i, e) {
        const updatedList = this.state.contactNumbers.filter((item, j) => i !== j);
        this.setState({
            contactNumbers: updatedList
        });
    }

    handleContactNumberChanged(i, p, e) {

        let contactNumbers = this.state.contactNumbers.slice();

        contactNumbers[i][p] = e.target.value;

        this.setState((state) => {
            contactNumbers: contactNumbers
        });
    }

    handleWorkingHourChanged(i, p, e) {

        let workingHours = this.state.workingHours.slice();

        workingHours[i][p] = e.target.value;

        this.setState((state) => {
            workingHours: workingHours
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        if(!this.state.data.name){
            NotificationManager.error("Please enter a name");       
            return;     
        }

        if(this.state.contactNumbers == null || !Array.isArray(this.state.contactNumbers) || this.state.contactNumbers.length < 1){
            NotificationManager.error("Please enter atleast one contact number");   
            return;            
        }

        if(!this.state.data.address.city){
            NotificationManager.error("Please enter the city");   
            return;            
        }

        var pinCodeRegex = new RegExp("^[1-9][0-9]{5}$");
        if (!pinCodeRegex.test(this.state.data.address.pinCode)) {
            NotificationManager.error("Pincode is not in valid format");
            return;
        }

        this.state.data.contactNumbers = this.state.contactNumbers;
        this.state.data.workingHours = this.state.workingHours;

        this.setState({
            isBusy: true
        });

        var apiUrl = config.apiBaseUrl + 'stores/' + this.props.storeSlug + "/branches/";
        axios.post(apiUrl, this.state.data, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {

                this.setState({
                    isBusy: false
                });

                NotificationManager.alert("Branch created Successfully");

                window.history.back();
            })
            .catch(error => {
            
                if(error.response){
                    NotificationManager.error(error.response.data.message);
                }
                else{
                    NotificationManager.error(error);
                }
                
                this.setState({
                    isBusy: false
                });
            });
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <BusyIndicator message="Saving Store Branch"/>;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/stores"><a>Stores</a></Link></li>
                        <li className="breadcrumb-item"><Link href={"/store/" + this.props.storeSlug}><a>{this.props.storeName}</a></Link></li>
                        <li className="breadcrumb-item"><Link href={"/store/" + this.props.storeSlug + '/branches'}><a>Branches</a></Link></li>
                        <li className="breadcrumb-item active">New</li>
                    </ol>
                </nav>
                <h1>{this.state.pageTitle}</h1>
                <form role="form" onSubmit={this.handleSubmit} className="my-5">
                    <div asp-validation-summary="All" className="text-danger" />
                    <div className="form-section">
                        <h4>Primary Details</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Name</label>
                                <input className="form-control"
                                    id="title"
                                    name="data.name"
                                    value={this.state.data.name}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <h4>Contact Numbers</h4>
                        <hr />
                        <button className="btn btn-secondary" type="button" onClick={() => this.onAddContactNumber()}><i className="fas fa-plus"></i></button>
                        {this.state.contactNumbers.map((contactNumber, i) =>
                            <div className="form-row" key={i}>
                                <div className="form-group col-md-5">
                                    <label>Type</label>
                                    <select
                                        name="type"
                                        defaultValue={contactNumber.type}
                                        className="form-control"
                                        onChange={e => this.handleContactNumberChanged(i, 'type', e)}
                                    >
                                        <option>Please select Contact Type</option>
                                        <option value="landline">Landline</option>
                                        <option value="mobile">Mobile</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-5">
                                    <label>Number</label>
                                    <input className="form-control"
                                        id="contactnumber"
                                        name="number"
                                        defaultValue={contactNumber.number}
                                        onChange={e => this.handleContactNumberChanged(i, 'number', e)}
                                        required
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <button className="btn btn-danger mt-4" type="button" onClick={() => this.onRemoveContactNumber(i)}><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-section">
                        <h4>Address</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Pincode</label>
                                <input className="form-control"
                                    type="number"
                                    id="pinCode"
                                    name="data.address.pinCode"
                                    value={this.state.data.address.pincode}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Locality</label>
                                <input className="form-control"
                                    id="locality"
                                    name="data.address.locality"
                                    value={this.state.data.address.locality}
                                    onChange={this.handleInputChange}
                                    />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="about">Address (Area and Street)</label>
                                <textarea className="form-control" id="data.address.street" rows="4" cols="50"
                                    name="data.address.street"
                                    value={this.state.data.address.street}
                                    onChange={this.handleInputChange} aria-describedby="emailHelp" placeholder="Enter Address (Area and Street)" required/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>City</label>
                                <input className="form-control"
                                    id="city"
                                    name="data.address.city"
                                    value={this.state.data.address.city}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>State</label>
                                <select id="state" name="data.address.state" value={this.state.data.address.state}
                                    className="form-control"
                                    onChange={this.handleInputChange}>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                                    <option value="Daman and Diu">Daman and Diu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Puducherry">Puducherry</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country</label>
                                <select id="country" name="data.address.country" value={this.state.data.address.country}
                                    className="form-control"
                                    onChange={this.handleInputChange}>
                                    <option value="Afganistan">Afghanistan</option>
                                    <option value="Albania">Albania</option>
                                    <option value="Algeria">Algeria</option>
                                    <option value="American Samoa">American Samoa</option>
                                    <option value="Andorra">Andorra</option>
                                    <option value="Angola">Angola</option>
                                    <option value="Anguilla">Anguilla</option>
                                    <option value="Antigua & Barbuda">Antigua & Barbuda</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Armenia">Armenia</option>
                                    <option value="Aruba">Aruba</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Austria">Austria</option>
                                    <option value="Azerbaijan">Azerbaijan</option>
                                    <option value="Bahamas">Bahamas</option>
                                    <option value="Bahrain">Bahrain</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Barbados">Barbados</option>
                                    <option value="Belarus">Belarus</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Belize">Belize</option>
                                    <option value="Benin">Benin</option>
                                    <option value="Bermuda">Bermuda</option>
                                    <option value="Bhutan">Bhutan</option>
                                    <option value="Bolivia">Bolivia</option>
                                    <option value="Bonaire">Bonaire</option>
                                    <option value="Bosnia & Herzegovina">Bosnia & Herzegovina</option>
                                    <option value="Botswana">Botswana</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
                                    <option value="Brunei">Brunei</option>
                                    <option value="Bulgaria">Bulgaria</option>
                                    <option value="Burkina Faso">Burkina Faso</option>
                                    <option value="Burundi">Burundi</option>
                                    <option value="Cambodia">Cambodia</option>
                                    <option value="Cameroon">Cameroon</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Canary Islands">Canary Islands</option>
                                    <option value="Cape Verde">Cape Verde</option>
                                    <option value="Cayman Islands">Cayman Islands</option>
                                    <option value="Central African Republic">Central African Republic</option>
                                    <option value="Chad">Chad</option>
                                    <option value="Channel Islands">Channel Islands</option>
                                    <option value="Chile">Chile</option>
                                    <option value="China">China</option>
                                    <option value="Christmas Island">Christmas Island</option>
                                    <option value="Cocos Island">Cocos Island</option>
                                    <option value="Colombia">Colombia</option>
                                    <option value="Comoros">Comoros</option>
                                    <option value="Congo">Congo</option>
                                    <option value="Cook Islands">Cook Islands</option>
                                    <option value="Costa Rica">Costa Rica</option>
                                    <option value="Cote DIvoire">Cote DIvoire</option>
                                    <option value="Croatia">Croatia</option>
                                    <option value="Cuba">Cuba</option>
                                    <option value="Curaco">Curacao</option>
                                    <option value="Cyprus">Cyprus</option>
                                    <option value="Czech Republic">Czech Republic</option>
                                    <option value="Denmark">Denmark</option>
                                    <option value="Djibouti">Djibouti</option>
                                    <option value="Dominica">Dominica</option>
                                    <option value="Dominican Republic">Dominican Republic</option>
                                    <option value="East Timor">East Timor</option>
                                    <option value="Ecuador">Ecuador</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="El Salvador">El Salvador</option>
                                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                                    <option value="Eritrea">Eritrea</option>
                                    <option value="Estonia">Estonia</option>
                                    <option value="Ethiopia">Ethiopia</option>
                                    <option value="Falkland Islands">Falkland Islands</option>
                                    <option value="Faroe Islands">Faroe Islands</option>
                                    <option value="Fiji">Fiji</option>
                                    <option value="Finland">Finland</option>
                                    <option value="France">France</option>
                                    <option value="French Guiana">French Guiana</option>
                                    <option value="French Polynesia">French Polynesia</option>
                                    <option value="French Southern Ter">French Southern Ter</option>
                                    <option value="Gabon">Gabon</option>
                                    <option value="Gambia">Gambia</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Gibraltar">Gibraltar</option>
                                    <option value="Great Britain">Great Britain</option>
                                    <option value="Greece">Greece</option>
                                    <option value="Greenland">Greenland</option>
                                    <option value="Grenada">Grenada</option>
                                    <option value="Guadeloupe">Guadeloupe</option>
                                    <option value="Guam">Guam</option>
                                    <option value="Guatemala">Guatemala</option>
                                    <option value="Guinea">Guinea</option>
                                    <option value="Guyana">Guyana</option>
                                    <option value="Haiti">Haiti</option>
                                    <option value="Hawaii">Hawaii</option>
                                    <option value="Honduras">Honduras</option>
                                    <option value="Hong Kong">Hong Kong</option>
                                    <option value="Hungary">Hungary</option>
                                    <option value="Iceland">Iceland</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="India">India</option>
                                    <option value="Iran">Iran</option>
                                    <option value="Iraq">Iraq</option>
                                    <option value="Ireland">Ireland</option>
                                    <option value="Isle of Man">Isle of Man</option>
                                    <option value="Israel">Israel</option>
                                    <option value="Italy">Italy</option>
                                    <option value="Jamaica">Jamaica</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Kazakhstan">Kazakhstan</option>
                                    <option value="Kenya">Kenya</option>
                                    <option value="Kiribati">Kiribati</option>
                                    <option value="Korea North">Korea North</option>
                                    <option value="Korea Sout">Korea South</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                                    <option value="Laos">Laos</option>
                                    <option value="Latvia">Latvia</option>
                                    <option value="Lebanon">Lebanon</option>
                                    <option value="Lesotho">Lesotho</option>
                                    <option value="Liberia">Liberia</option>
                                    <option value="Libya">Libya</option>
                                    <option value="Liechtenstein">Liechtenstein</option>
                                    <option value="Lithuania">Lithuania</option>
                                    <option value="Luxembourg">Luxembourg</option>
                                    <option value="Macau">Macau</option>
                                    <option value="Macedonia">Macedonia</option>
                                    <option value="Madagascar">Madagascar</option>
                                    <option value="Malaysia">Malaysia</option>
                                    <option value="Malawi">Malawi</option>
                                    <option value="Maldives">Maldives</option>
                                    <option value="Mali">Mali</option>
                                    <option value="Malta">Malta</option>
                                    <option value="Marshall Islands">Marshall Islands</option>
                                    <option value="Martinique">Martinique</option>
                                    <option value="Mauritania">Mauritania</option>
                                    <option value="Mauritius">Mauritius</option>
                                    <option value="Mayotte">Mayotte</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Midway Islands">Midway Islands</option>
                                    <option value="Moldova">Moldova</option>
                                    <option value="Monaco">Monaco</option>
                                    <option value="Mongolia">Mongolia</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Morocco">Morocco</option>
                                    <option value="Mozambique">Mozambique</option>
                                    <option value="Myanmar">Myanmar</option>
                                    <option value="Nambia">Nambia</option>
                                    <option value="Nauru">Nauru</option>
                                    <option value="Nepal">Nepal</option>
                                    <option value="Netherland Antilles">Netherland Antilles</option>
                                    <option value="Netherlands">Netherlands (Holland, Europe)</option>
                                    <option value="Nevis">Nevis</option>
                                    <option value="New Caledonia">New Caledonia</option>
                                    <option value="New Zealand">New Zealand</option>
                                    <option value="Nicaragua">Nicaragua</option>
                                    <option value="Niger">Niger</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Niue">Niue</option>
                                    <option value="Norfolk Island">Norfolk Island</option>
                                    <option value="Norway">Norway</option>
                                    <option value="Oman">Oman</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Palau Island">Palau Island</option>
                                    <option value="Palestine">Palestine</option>
                                    <option value="Panama">Panama</option>
                                    <option value="Papua New Guinea">Papua New Guinea</option>
                                    <option value="Paraguay">Paraguay</option>
                                    <option value="Peru">Peru</option>
                                    <option value="Phillipines">Philippines</option>
                                    <option value="Pitcairn Island">Pitcairn Island</option>
                                    <option value="Poland">Poland</option>
                                    <option value="Portugal">Portugal</option>
                                    <option value="Puerto Rico">Puerto Rico</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Republic of Montenegro">Republic of Montenegro</option>
                                    <option value="Republic of Serbia">Republic of Serbia</option>
                                    <option value="Reunion">Reunion</option>
                                    <option value="Romania">Romania</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Rwanda">Rwanda</option>
                                    <option value="St Barthelemy">St Barthelemy</option>
                                    <option value="St Eustatius">St Eustatius</option>
                                    <option value="St Helena">St Helena</option>
                                    <option value="St Kitts-Nevis">St Kitts-Nevis</option>
                                    <option value="St Lucia">St Lucia</option>
                                    <option value="St Maarten">St Maarten</option>
                                    <option value="St Pierre & Miquelon">St Pierre & Miquelon</option>
                                    <option value="St Vincent & Grenadines">St Vincent & Grenadines</option>
                                    <option value="Saipan">Saipan</option>
                                    <option value="Samoa">Samoa</option>
                                    <option value="Samoa American">Samoa American</option>
                                    <option value="San Marino">San Marino</option>
                                    <option value="Sao Tome & Principe">Sao Tome & Principe</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="Senegal">Senegal</option>
                                    <option value="Seychelles">Seychelles</option>
                                    <option value="Sierra Leone">Sierra Leone</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Slovakia">Slovakia</option>
                                    <option value="Slovenia">Slovenia</option>
                                    <option value="Solomon Islands">Solomon Islands</option>
                                    <option value="Somalia">Somalia</option>
                                    <option value="South Africa">South Africa</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="Sudan">Sudan</option>
                                    <option value="Suriname">Suriname</option>
                                    <option value="Swaziland">Swaziland</option>
                                    <option value="Sweden">Sweden</option>
                                    <option value="Switzerland">Switzerland</option>
                                    <option value="Syria">Syria</option>
                                    <option value="Tahiti">Tahiti</option>
                                    <option value="Taiwan">Taiwan</option>
                                    <option value="Tajikistan">Tajikistan</option>
                                    <option value="Tanzania">Tanzania</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="Togo">Togo</option>
                                    <option value="Tokelau">Tokelau</option>
                                    <option value="Tonga">Tonga</option>
                                    <option value="Trinidad & Tobago">Trinidad & Tobago</option>
                                    <option value="Tunisia">Tunisia</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="Turkmenistan">Turkmenistan</option>
                                    <option value="Turks & Caicos Is">Turks & Caicos Is</option>
                                    <option value="Tuvalu">Tuvalu</option>
                                    <option value="Uganda">Uganda</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Ukraine">Ukraine</option>
                                    <option value="United Arab Erimates">United Arab Emirates</option>
                                    <option value="United States of America">United States of America</option>
                                    <option value="Uraguay">Uruguay</option>
                                    <option value="Uzbekistan">Uzbekistan</option>
                                    <option value="Vanuatu">Vanuatu</option>
                                    <option value="Vatican City State">Vatican City State</option>
                                    <option value="Venezuela">Venezuela</option>
                                    <option value="Vietnam">Vietnam</option>
                                    <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
                                    <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
                                    <option value="Wake Island">Wake Island</option>
                                    <option value="Wallis & Futana Is">Wallis & Futana Is</option>
                                    <option value="Yemen">Yemen</option>
                                    <option value="Zaire">Zaire</option>
                                    <option value="Zambia">Zambia</option>
                                    <option value="Zimbabwe">Zimbabwe</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-section">
                        <h4>Working Hours</h4>
                        <hr />
                        {this.state.workingHours.map((workingHour, i) =>
                            <div className="form-row" key={i}>
                                <div className="form-group col-md-2">
                                    <label>Day</label>
                                    <input className="form-control"
                                        id="day"
                                        name="day"
                                        defaultValue={workingHour.day}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label>State</label>
                                    <select
                                        name="state"
                                        defaultValue={workingHour.state}
                                        className="form-control"
                                        onChange={e => this.handleWorkingHourChanged(i, 'state', e)}
                                    >
                                        <option>Please select State</option>
                                        <option value="Specific Timings">Specific Timings</option>
                                        <option value="Is Closed">Is Closed</option>
                                        <option value="Is Always Open">Is Always Open</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-2">
                                    <label>Start</label>
                                    <input type="time" className="form-control"
                                        id="start"
                                        name="start"
                                        defaultValue={workingHour.start}
                                        onChange={e => this.handleWorkingHourChanged(i, 'start', e)}
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <label>End</label>
                                    <input type="time" className="form-control"
                                        id="end"
                                        name="end"
                                        defaultValue={workingHour.end}
                                        onChange={e => this.handleWorkingHourChanged(i, 'end', e)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="btn btn-primary btn-lg" >Save</button>
                </form>
            </div>;
        }

        return content;
    }
}


export default privateRoute(AddStoreBranch);