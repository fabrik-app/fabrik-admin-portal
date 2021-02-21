
import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../../config';
import moment from 'moment';
import { privateRoute } from '../../../privateRoute';

class EditContact extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pageTitle: "Update Contact",
            data: {
                id: null,
                name: "",
                type: "Boutique",
                rating: 0,
                about: "",
                website: "",
                slug: "",
                branches: [],
                seo: {
                    title: "",
                    description: "",
                    keywords: ""
                },
                paymentModes: [],
                services: [],
                establishedOn: null,
                isActive: true,
                isVerified: false
            },
            metaTitleCharCount: 0,
            metaDescriptionCharCount: 0,
            metaKeywordsCharCount: 0,
            paymentModes: [
                { text: 'Cash', checked: true },
                { text: 'Debit Card', checked: false },
                { text: 'Credit Card', checked: false }
            ],
            services: [
                { text: 'Materials', checked: false },
                { text: 'Designing', checked: false },
                { text: 'Stiching', checked: false },
                { text: 'Embroidery', checked: false }
            ],
            contactNumbers: [],
            socialMedia: []
        };  

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
        this.handleEstablishedOnChange = this.handleEstablishedOnChange.bind(this);
        this.handleMetaTitle = this.handleMetaTitle.bind(this);
        this.handleMetaDescription = this.handleMetaDescription.bind(this);
        this.handleMetaKeywords = this.handleMetaKeywords.bind(this);
        this.onRemoveContactNumber = this.onRemoveContactNumber.bind(this);
        this.onAddContactNumber = this.onAddContactNumber.bind(this);
        this.handleContactNumberChanged = this.handleContactNumberChanged.bind(this);
        this.onRemoveSocialMedia = this.onRemoveSocialMedia.bind(this);
        this.onAddSocialMedia = this.onAddSocialMedia.bind(this);
        this.handleSocialMediaChanged = this.handleSocialMediaChanged.bind(this);
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

    handleEstablishedOnChange(value, formattedValue) {

        var data = { ...this.state.data };
        data.establishedOn = value;

        this.setState({
            data: data
        });
    }

    handleTelephoneNumber(e) {
        var currentValue = e.target.value;
        e.target.value = currentValue.replace(/[^+\d]+/g, "");
        this.handleInputChange(e);
    }

    handleMetaTitle(e) {
        var input = e.target.value;
        this.setState({
            metaTitleCharCount: 60 - input.length
        });
        this.handleInputChange(e);
    }

    handleMetaDescription(e) {
        var input = e.target.value;
        this.setState({
            metaDescriptionCharCount: 160 - input.length
        });
        this.handleInputChange(e);
    }

    handleMetaKeywords(e) {
        var input = e.target.value;
        this.setState({
            metaKeywordsCharCount: 200 - input.length
        });
        this.handleInputChange(e);
    }

    handlePaymentModeChanged(index, e) {

        let newItems = this.state.paymentModes.slice();
        newItems[index].checked = !newItems[index].checked

        this.setState({
            paymentModes: newItems
        });
    }

    handleServicesChanged(index, e) {

        let newItems = this.state.services.slice();
        newItems[index].checked = !newItems[index].checked

        this.setState({
            services: newItems
        });
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

    onAddSocialMedia() {

        const updatedList = [...this.state.socialMedia, {
            website: "facebook",
            link: ""
        }];

        this.setState({
            socialMedia: updatedList
        });
    }

    onRemoveSocialMedia(i, e) {
        const updatedList = this.state.socialMedia.filter((item, j) => i !== j);
        this.setState({
            socialMedia: updatedList
        });
    }

    handleSocialMediaChanged(i, p, e) {

        let socialMedias = this.state.socialMedia.slice();

        socialMedias[i][p] = e.target.value;

        this.setState((state) => {
            socialMedia: socialMedias
        });
    }

    handleSubmit(event) {
        
        event.preventDefault();
        
        debugger;

        if(!this.state.data.name){
            alert("Please enter a Contact name");            
        }

        if(!this.state.data.type){
            alert("Please enter a Contact Type");            
        }

        this.setState({
            isBusy: true
        });

        var currentPaymentModes = this.state.paymentModes.filter(m => m.checked === true);
        this.state.data.paymentModes = currentPaymentModes.map(m => m.text);

        var selectedServices = this.state.services.filter(m => m.checked === true);
        this.state.data.services = selectedServices.map(m => m.text);

        this.state.data.contactNumbers = this.state.contactNumbers;
        this.state.data.socialMedia = this.state.socialMedia;

        var createDataUrl = config.apiBaseUrl + 'contacts';
        axios.post(createDataUrl, this.state.data, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
        .then(apiResult => {

            this.setState({
                isBusy: false
            });

            alert("Contact created Successfully");

            window.history.back();
        })
        .catch(error => alert(error));
    }

    render() {
        let content;
        if (this.state.isBusy) {
            content = <div>Loading Contact Details</div>;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href="/contacts">Contacts</Link></li>
                        <li className="breadcrumb-item">{this.state.pageTitle}</li>
                    </ol>
                </nav>
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
                                    name="data.name"
                                    value={this.state.data.name}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Store Type</label>
                                <select id="data.type"
                                    name="data.type"
                                    value={this.state.data.type}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select Contact Type</option>
                                    <option value="Boutique">Customer</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label>Rating</label>
                                <input type="number"
                                    min={0}
                                    max={5}
                                    step="0.1"
                                    id="rating"
                                    name="store.rating"
                                    value={this.state.data.rating}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>About</label>
                                <textarea id="about"
                                    name="data.about"
                                    className="form-control"
                                    value={this.state.data.about}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Website</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Website</label>
                                <input id="website"
                                    name="data.website"
                                    value={this.state.data.website}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>SEO</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Slug</label>
                                <input id="slug"
                                    name="data.slug"
                                    value={this.state.data.slug}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Title</label>
                                <input id="sEO.Title"
                                    name="data.seo.title"
                                    value={this.state.data.seo.title}
                                    onChange={this.handleMetaTitle}
                                    className="form-control" />
                                <p>Characters Left: {this.state.metaTitleCharCount}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Description</label>
                                <textarea id="sEO.Description"
                                    name="data.seo.description"
                                    value={this.state.data.seo.description}
                                    onChange={this.handleMetaDescription}
                                    className="form-control"
                                    rows={4}
                                />
                                <p>Characters Left: {this.state.metaDescriptionCharCount}</p>
                            </div>
                            <div className="form-group col-md-6">
                                <label>Meta Keywords</label>
                                <textarea id="sEO.Keywords"
                                    name="data.seo.keywords"
                                    className="form-control"
                                    value={this.state.data.seo.keywords}
                                    onChange={this.handleMetaKeywords}
                                    rows={4} />
                                <p>Characters Left: {this.state.metaKeywordsCharCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Contact Numbers</h4>
                        <hr />
                        <button className="btn btn-secondary" type="button" onClick={() => this.onAddContactNumber()}><i class="fas fa-plus"></i></button>
                        {this.state.contactNumbers.map((contactNumber, i) =>
                            <div className="form-row">
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
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <button className="btn btn-danger mt-4" type="button" onClick={() => this.onRemoveContactNumber(i)}><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        )}
                        <br />
                    </div>
                    <div className="container">
                        <h4>Social Media</h4>
                        <hr />
                        <button className="btn btn-secondary" type="button" onClick={() => this.onAddSocialMedia()}><i class="fas fa-plus"></i></button>
                        {this.state.socialMedia.map((media, i) =>
                            <div className="form-row">
                                <div className="form-group col-md-5">
                                    <label>Website</label>
                                    <select
                                        name="website"
                                        defaultValue={media.website}
                                        className="form-control"
                                        onChange={e => this.handleSocialMediaChanged(i, 'website', e)}
                                    >
                                        <option>Please select Website</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="instagram">Instagram</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-5">
                                    <label>Link</label>
                                    <input className="form-control"
                                        id="link"
                                        name="link"
                                        defaultValue={media.link}
                                        onChange={e => this.handleSocialMediaChanged(i, 'link', e)}
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <button className="btn btn-danger mt-4" type="button" onClick={() => this.onRemoveSocialMedia(i)}><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        )}
                        <br />
                    </div>
                    <div className="container">
                        <h4>Services</h4>
                        <hr />
                        <div className="form-row">
                            {this.state.services.map((service, i) =>
                                <div className="form-check form-check-inline">
                                    <input type="checkbox"
                                        name="service"
                                        checked={service.checked}
                                        onChange={this.handleServicesChanged.bind(this, i)}
                                        className="form-check-input" />
                                    <label className="form-check-label">{service.text}</label>
                                </div>
                            )}
                        </div>
                        <br />
                    </div>
                    <div className="container">
                        <h4>Payment Modes</h4>
                        <hr />
                        <div className="form-row">
                            {this.state.paymentModes.map((paymentMode, i) =>
                                <div className="form-check form-check-inline">
                                    <input type="checkbox"
                                        name="paymentmode"
                                        checked={paymentMode.checked}
                                        onChange={this.handlePaymentModeChanged.bind(this, i)}
                                        className="form-check-input" />
                                    <label className="form-check-label">{paymentMode.text}</label>
                                </div>
                            )}
                        </div>
                        <br/>
                    </div>
                    <div className="container">
                        <h4>Other Details</h4>
                        <hr />
                        {/* <div className="form-row">
                            <div className="form-group">
                                <label>Established On</label>
                                <DatePicker value={this.state.store.establishedOn} onChange={this.handleEstablishedOnChange} />
                            </div>
                        </div> */}
                        <div className="form-group">
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="isVerified"
                                    name="data.isVerified"
                                    checked={this.state.data.isVerified}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Is Verified
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox"
                                    name ="data.isActive"
                                    checked={this.state.data.isActive}
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

export default privateRoute(EditContact);