import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import NotificationManager from '../../services/notificationManager';
import ImageGallery from 'react-image-gallery';
import LabelControl from '../../components/labelControlComponent';
import IconControl from '../../components/iconControlComponent';
import TypeIconControl from '../../components/typeIconControl';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';

class StoreDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            sliderImages: [],
            showModal: false,
            crawlEnabled: false
        };

        this.removeItem = this.removeItem.bind(this);
        this.getWebsiteBotStatus = this.getWebsiteBotStatus.bind(this);
        this.enableBot = this.enableBot.bind(this);
        this.handleModalShowClick = this.handleModalShowClick.bind(this);
        this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
    }

    componentDidMount() {
        this.getWebsiteBotStatus();
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'stores/' + props.query.slug;

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        var data = apiResult.data;
        if (!data.seo) {
            data.seo = {
                title: "",
                description: "",
                keywords: ""
            }
        }

        return {
            auth: props.auth,
            data: data
        }
    }

    getWebsiteBotStatus(domain) {

        var botWebsiteStatusApiEndpoint = config.robotsApiBaseUrl + "bot/status?domain=" + this.state.data.website;

        axios.get(botWebsiteStatusApiEndpoint, {
            headers: { Authorization: `Bearer ${this.props.auth.token}` }
        })
            .then(apiResult => {
                if (apiResult.data) {
                    this.setState({
                        crawlEnabled: true
                    });
                }
                else {
                    this.setState({
                        crawlEnabled: false
                    });
                }
            })
            .catch(error => {
                this.setState({
                    crawlEnabled: false
                });
            });
    }

    enableBot() {
        if (this.state.crawlEnabled) {
            var r = confirm("Are you sure, you want to disable Bot for this Store");
            if (r == true) {

                var payload = {
                    domain: this.state.data.website,
                    status: false
                };

                var botEnableApiEndpoint = config.robotsApiBaseUrl + "bot/status";
                axios.put(botEnableApiEndpoint, payload, {
                    headers: { Authorization: `Bearer ${this.props.auth.token}` }
                })
                .then(apiResult => {
                    toast("Bot disabled Successfully");
                    this.setState({
                        crawlEnabled: false
                    });
                })
                .catch(error => {
                    alert(error.response.data.message);
                });
            }
        }
        else {
            var r = confirm("Are you sure, you want to enable Bot for this Store");
            if (r == true) {

                var payload = {
                    domain: this.state.data.website,
                    status: true
                };

                var botDisableApiEndpoint = config.robotsApiBaseUrl + "bot/status";
                axios.put(botDisableApiEndpoint, payload, {
                    headers: { Authorization: `Bearer ${this.props.auth.token}` }
                })
                .then(apiResult => {
                    toast("Bot enabled Successfully");
                    this.setState({
                        crawlEnabled: true
                    });
                })
                .catch(error => {
                    alert(error.response.data.message);
                });
            }
        }
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Store");
        if (r == true) {
            var dataDeleteApiEndpoint = config.apiBaseUrl + 'stores/' + this.state.data.id;
            axios.delete(dataDeleteApiEndpoint, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
            .then(apiResult => {
                toast("Store deleted Successfully");
                window.history.back();
            })
            .catch(error => alert(error));
        }
    }

    handleModalShowClick(e) {
        this.setState({
            showModal: true
        })
    }

    handleModalCloseClick(selectedItems) {

        if (typeof selectedItems !== 'undefined' && selectedItems.length > 0) {

            var designers = [];
            for (var i = 0; i < selectedItems.length; i++) {
                designers.push({ id: selectedItems[i] });
            }

            var storeDesignersUpdateApiEndpoint = config.apiBaseUrl + 'store/' + this.state.data.id + "/designers";
            axios.put(storeDesignersUpdateApiEndpoint, designers)
                .then(apiResult => {
                    if (apiResult.data) {
                        alert("Updated successfully");
                    }

                    this.setState({
                        showModal: false
                    });
                })
                .catch(error => {
                    alert(error);

                    this.setState({
                        showModal: false
                    });
                });
        }
        else {
            this.setState({
                showModal: false
            });
        }
    }

    render() {
        const { showModal } = this.state;
        let content;
        if (this.state.isBusy) {
            content = <div>Loading Store Details</div>;
        }
        else {
            let fabrikUrl = "https://fabrik.in/boutique/" + this.state.data.slug;
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/stores"><a>Stores</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.state.data.name}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <a role="button" className={"btn btn-primary " + (this.state.data.isActive ? "" : "disabled")} target="_blank" href={fabrikUrl}><i className="fas fa-external-link-alt"></i> View</a>
                                <Link href={{ pathname: '/analytics/store/' + this.state.data.id, search: '?name=' + encodeURIComponent(this.state.data.name) + '&slug=' + encodeURIComponent(this.state.data.slug) }}>
                                    <a role="button" className="btn btn-primary"> Analytics</a>
                                </Link>
                                <Link href={{ pathname: '/store/media/' + this.state.data.slug, search: '?name=' + this.state.data.name }}>
                                    <a role="button" className="btn btn-primary"> Media</a>
                                </Link>
                                <Link href={{ pathname: '/store/' + this.state.data.slug + '/branches' }}>
                                    <a role="button" className="btn btn-primary"> Branches</a>
                                </Link>
                                <Link href={{ pathname: '/store/' + this.state.data.slug + '/edit' }}>
                                    <a role="button" className="btn btn-primary"> Edit</a>
                                </Link>
                                <a role="button" className="btn btn-primary" onClick={this.enableBot}> {this.state.crawlEnabled ? "Bot Enabled" : "Bot Disabled"}</a>
                                <a role="button" className="btn btn-primary" onClick={this.handleModalShowClick}> Designers</a>
                                <a role="button" className="btn btn-danger" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mb-5">
                    <h1 className="my-4">
                        {this.state.data.name}<span className="badge badge-success ml-3">{this.state.data.rating}</span>
                    </h1>
                    <div className="row">
                        <div className="col-md-8">
                            {/* <ImageGallery items={this.state.sliderImages} /> */}
                            <h3 className="my-3">About</h3>
                            <p>{this.state.data.about}</p>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Stats</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Views"><i className="far fa-eye" /> {this.state.data.views}</li>
                                            <li title="Likes"><i className="fas fa-heart" /> {this.state.data.likes}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Contact</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            {this.state.data.contactNumbers.map((contactNumber, i) =>
                                                <li title={contactNumber.type}><TypeIconControl type={contactNumber.type} />&nbsp;<LabelControl value={contactNumber.number} /></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="card-title">Web &amp; Social</h5>
                                    <div className="card-text">
                                        <ul className="list-inline">
                                            <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title="Website">
                                                <IconControl value={this.state.data.website} icon="fas fa-globe" />
                                            </li>
                                            {this.state.data.socialMedia.map((socialMedia, i) =>
                                                <li className="list-inline-item" data-toggle="tooltip" data-placement="left" title={socialMedia.website}>
                                                    <a href={socialMedia.link} target="_blank">
                                                        <TypeIconControl type={socialMedia.website} />
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {showModal ? (<DesignerSelector handleModalCloseClick={this.handleModalCloseClick} />) : null} */}
            </div>;
        }

        return content;
    }
}

export default privateRoute(StoreDetails);