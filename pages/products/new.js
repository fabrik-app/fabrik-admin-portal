import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../config';
import moment from 'moment';

class CreateProduct extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: true,
            pageTitle: "Create new Product",
            product: {
                id: null,
                title: "",
                productType: "Saree",
                rating: 0,
                description: "",
                features: "",
                actualPrice: 0,
                discount: 0,
                sellingPrice: 0,
                slug: "",
                seo: {
                    title: "",
                    description: "",
                    keywords: ""
                },
                isActive: false,
                isVerified: false
            },
            metaTitleCharCount: 0,
            metaDescriptionCharCount: 0,
            metaKeywordsCharCount: 0,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStoreTimingChange = this.handleStoreTimingChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
        this.placeClicked = this.placeClicked.bind(this);
        this.handleEstablishedOnChange = this.handleEstablishedOnChange.bind(this);
        this.handleMetaTitle = this.handleMetaTitle.bind(this);
        this.handleMetaDescription = this.handleMetaDescription.bind(this);
        this.handleMetaKeywords = this.handleMetaKeywords.bind(this);
    }

    componentDidMount() {
        this.setState({ isBusy: false });
    }

    placeClicked(place) {

        var store = { ...this.state.store };

        store.name = place.name;
        store.landline = place.landline.replace(/[^+\d]+/g, "");
        store.rating = place.rating;
        store.website = place.website;

        store.timings = place.timings;

        this.setState({
            store: store
        });

        toast("Imported Place details successfully");
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

    handleEstablishedOnChange(e) {
        var thatVal = "";
        if (typeof e == "string") {
            thatVal = e;
        }
        else {
            thatVal = e.format("MM-DD-YYYY");
        }

        var store = { ...this.state.store };
        store.establishedOn = thatVal;

        this.setState({
            store: store
        });
    }

    handleStoreTimingChange(index, type, e) {
        var thatVal = "";
        if (typeof e == "string") {
            thatVal = e;
        }
        else {
            thatVal = e.format("hh:mm A");
        }

        this.setState(state => {
            const list = state.store.timings.map((item, j) => {
                if (j === index) {
                    {
                        if (type == "start") {
                            item.start = thatVal;
                        }
                        else if (type == "end") {
                            item.end = thatVal;
                        }
                    }
                } else {
                    return item;
                }
            });

            return {
                list,
            };
        });
    }

    handleStoreTimingChecksChange(index, type, e) {
        var thatVal = e.target.checked;

        this.setState(state => {
            const list = state.store.timings.map((item, j) => {
                if (j === index) {
                    {
                        if (type == "isClosed") {
                            item.isClosed = thatVal;
                        }
                        else if (type == "isAlwaysOpen") {
                            item.isAlwaysOpen = thatVal;
                        }
                    }
                } else {
                    return item;
                }
            });

            return {
                list,
            };
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

    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            isBusy: true
        });

        if (this.state.product.id == null) {
            var createProductUrl = "http://localhost:53304/api/v1/" + 'products';
            axios.post(createProductUrl, this.state.product)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Product created Successfully");

                    window.history.back();
                })
                .catch(error => alert(error));
        }
        else {
            var updateProductUrl = appConfig.apiBaseUrl + 'product/' + this.state.product.id;
            axios.put(updateProductUrl, this.state.product)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Product updated Successfully");

                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Product Details</div>;
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
                                <label>Title</label>
                                <input className="form-control"
                                    id="title"
                                    name="product.title"
                                    value={this.state.product.title}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Store Type</label>
                                <select id="product.productType"
                                    name="product.productType"
                                    value={this.state.product.productType}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select Product Type</option>
                                    <option value="Western Wear">Western Wear</option>
                                    <option value="Tops, Tees & Shirts">Tops, Tees & Shirts</option>
                                    <option value="Leggings">Leggings</option>
                                    <option value="Dresses">Dresses</option>
                                    <option value="Skirts">Skirts</option>
                                    <option value="Jumpsuits & Playsuits">Jumpsuits & Playsuits</option>
                                    <option value="Trousers">Trousers</option>
                                    <option value="Coats & Jackets">Coats & Jackets</option>
                                    <option value="Shorts">Shorts</option>
                                    <option value="Sweatshirts & Hoodies">Sweatshirts & Hoodies</option>
                                    <option value="Sweaters">Sweaters</option>
                                    <option value="Ethnic Wear">Ethnic Wear</option>
                                    <option value="Sarees">Sarees</option>
                                    <option value="Fabric">Fabric</option>
                                    <option value="Multi Purpose Fabric">Multi Purpose Fabric</option>
                                    <option value="Lace">Lace</option>
                                    <option value="Gown Material">Gown Material</option>
                                    <option value="Blouse Material">Blouse Material</option>
                                    <option value="Kurta Kurti Fabric">Kurta Kurti Fabric</option>
                                    <option value="Kurtas & Kurtis">Kurtas & Kurtis</option>
                                    <option value="Dress Material">Dress Material</option>
                                    <option value="Salwar Suits">Salwar Suits</option>
                                    <option value="Lehenga Cholis">Lehenga Cholis</option>
                                    <option value="Gowns">Gowns</option>
                                    <option value="Bottoms">Bottoms</option>
                                    <option value="Saree Blouses">Saree Blouses</option>
                                    <option value="Dupattas & Stoles">Dupattas & Stoles</option>
                                    <option value="Shawls">Shawls</option>
                                    <option value="Lingerie & Nightwear">Lingerie & Nightwear</option>
                                    <option value="Lingerie & Underwear">Lingerie & Underwear</option>
                                    <option value="Nightwear">Nightwear</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label>Rating</label>
                                <input type="number"
                                    min={0}
                                    max={5}
                                    step="0.1"
                                    id="rating"
                                    name="product.rating"
                                    value={this.state.product.rating}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Description</label>
                                <textarea id="description"
                                    name="product.description"
                                    className="form-control"
                                    value={this.state.product.description}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Features</label>
                                <textarea id="features"
                                    name="product.features"
                                    className="form-control"
                                    value={this.state.product.features}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Pricing</h4>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label>Actual Price</label>
                                <input id="actualPrice"
                                    name="product.actualPrice"
                                    value={this.state.product.actualPrice}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Discount</label>
                                <input id="discount"
                                    name="product.discount"
                                    value={this.state.product.discount}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                            <div className="form-group col-md-3">
                                <label>Selling Price</label>
                                <input id="sellingPrice"
                                    name="product.sellingPrice"
                                    value={this.state.product.sellingPrice}
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
                                    name="product.slug"
                                    value={this.state.product.slug}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Title</label>
                                <input id="sEO.Title"
                                    name="product.seo.title"
                                    value={this.state.product.seo.title}
                                    onChange={this.handleMetaTitle}
                                    className="form-control" />
                                <p>Characters Left: {this.state.metaTitleCharCount}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Description</label>
                                <textarea id="sEO.Description"
                                    name="product.seo.description"
                                    value={this.state.product.seo.description}
                                    onChange={this.handleMetaDescription}
                                    className="form-control"
                                    rows={4}
                                />
                                <p>Characters Left: {this.state.metaDescriptionCharCount}</p>
                            </div>
                            <div className="form-group col-md-6">
                                <label>Meta Keywords</label>
                                <textarea id="sEO.Keywords"
                                    name="product.seo.keywords"
                                    className="form-control"
                                    value={this.state.product.seo.keywords}
                                    onChange={this.handleMetaKeywords}
                                    rows={4} />
                                <p>Characters Left: {this.state.metaKeywordsCharCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Other Details</h4>
                        <hr />
                        <div className="form-group">
                            <div className="form-check form-check-inline">
                                <input type="checkbox" id="isVerified"
                                    name="product.isVerified"
                                    checked={this.state.product.isVerified}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label">
                                    Is Verified
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input type="checkbox"
                                    name="product.isActive"
                                    checked={this.state.product.isActive}
                                    onChange={this.handleInputChange}
                                    className="form-check-input" />
                                <label className="form-check-label" id="isActive" name="isActive">
                                    Is Active
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

export default CreateProduct;