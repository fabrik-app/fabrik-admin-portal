import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../../../config';
import dynamic from "next/dynamic";
import NotificationManager from '../../../services/notificationManager';
import ManageMediaCard from '../../../components/manageMediaCard';
const Image = dynamic(() => import('react-graceful-image'), { ssr: false });
import { privateRoute } from '../../../privateRoute';

class StoreMedias extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            storeId: 0,
            mediaUrl: "",
            pageUrl: "",
            mediaItems: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addMediaUrl = this.addMediaUrl.bind(this);
        this.importFromWebPage = this.importFromWebPage.bind(this);
        this.mediaFileChange = this.mediaFileChange.bind(this);
        this.mediaZipChange = this.mediaZipChange.bind(this);
        this.uploadMediaFile = this.uploadMediaFile.bind(this);
        this.uploadMediaZipFile = this.uploadMediaZipFile.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'stores/' + props.query.slug + "/medias/all";

        const storeMedias = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        }).then(res => res.data);

        return {
            storeName: props.query.name,
            storeSlug: props.query.slug,
            auth: props.auth,
            medias: storeMedias
        }
    }

    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    addMediaUrl() {
        var r = confirm("Are you sure, you want to add this media url");
        if (r == true) {

            var mediaUrl = this.state.mediaUrl;
            var encodedMediaUrl = encodeURI(mediaUrl);

            var payLoad = {
                url: encodedMediaUrl
            };

            var storeMediaDeleteApiEndpoint = config.apiBaseUrl + 'stores/' + this.props.storeSlug + '/medias/url';
            axios.post(storeMediaDeleteApiEndpoint, payLoad, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    NotificationManager.alert("Task Queued Successfully");
                    this.setState({
                        mediaUrl: ""
                    });
                })
                .catch(error => alert(error));
        }
    }

    importFromWebPage() {
        var r = confirm("Are you sure, you want to add media from this web page");
        if (r == true) {

            var pageUrl = this.state.pageUrl;
            var encodedPageUrl = encodeURI(pageUrl);

            var payLoad = {
                url: encodedPageUrl
            };

            var storeMediaImportFromWebPageApiEndpoint = config.apiBaseUrl + 'stores/' + this.props.storeSlug + '/medias/website';
            axios.post(storeMediaImportFromWebPageApiEndpoint, payLoad, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    NotificationManager.alert("Task Queued Successfully");
                    this.setState({
                        pageUrl: ""
                    });
                })
                .catch(error => alert(error));
        }
    }

    mediaFileChange(e) {
        this.setState({ mediaFile: e.target.files[0] })
    }

    mediaZipChange(e) {
        this.setState({ mediaZipFile: e.target.files[0] })
    }

    uploadMediaFile() {
        debugger;
        var r = confirm("Are you sure, you want to upload this file");
        if (r == true) {
            const formData = new FormData();
            formData.append('file', this.state.mediaFile);

            const headersConfig = {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: `Bearer ${this.props.auth.token}`
                }
            }

            console.log(this.props);

            var storeMediaFileUploadApiEndpoint = config.apiBaseUrl + 'stores/' + this.props.storeSlug + '/medias/file';
            axios.post(storeMediaFileUploadApiEndpoint, formData, headersConfig)
                .then(apiResult => {

                    this.setState(prev => ({
                        mediaItems: [apiResult.data, ...prev.mediaItems]
                    }));

                    NotificationManager.alert("Media uploaded successfully");
                })
                .catch(error => alert(error));
        }
    }

    uploadMediaZipFile() {
        var r = confirm("Are you sure, you want to upload this zip file");
        if (r == true) {
            const formData = new FormData();
            formData.append('file', this.state.mediaZipFile);
            const headersConfig = {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: `Bearer ${this.props.auth.token}`
                }
            }

            var storeMediaZipFileUploadApiEndpoint = config.apiBaseUrl + 'stores/' + this.props.storeSlug + '/medias/archive';
            axios.post(storeMediaZipFileUploadApiEndpoint, formData, headersConfig)
                .then(apiResult => {

                    this.setState(prev => ({
                        mediaItems: [apiResult.data, ...prev.mediaItems]
                    }));

                    NotificationManager.alert("Media zip uploaded successfully");
                })
                .catch(error => alert(error));
        }
    }

    render() {
        var that = this;
        var mediasList = this.props.medias.map(function (media, i) {
            return (<div className="col-md-4 col-sm-6 mt-3" key={i}>
                <ManageMediaCard slug={media.slug} storeSlug={that.props.storeSlug} image={media.name} rating={media.views} id={media.id} auth={that.props.auth} />
            </div>
            )
        });

        return (
            <div>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                            <li className="breadcrumb-item"><Link href="/stores"><a>Stores</a></Link></li>
                            <li className="breadcrumb-item" aria-current="page"><Link href={{ pathname: '/store/' + this.props.storeSlug }}><a>{this.props.storeName}</a></Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><a>Media</a></li>
                        </ol>
                    </nav>
                    <div className="row">
                        <div className="col-md">
                            <div className="d-flex justify-content-end">
                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#importfromFile">
                                        Upload
                                    </button>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#importfromZip">
                                        Upload Zip
                                    </button>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#importFromUrlModal">
                                        From Url
                                    </button>
                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#importfromWebPage">
                                        Import WebPage
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className="page-title">Store Media</h1>
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <div className="row">
                                {mediasList}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="importFromUrlModal" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Media Url</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Url</label>
                                        <input type="text" className="form-control" placeholder="Enter url of the media" name="mediaUrl" value={this.state.mediaUrl} onChange={this.handleInputChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.addMediaUrl} data-dismiss="modal">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="importfromWebPage" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Import from Webpage</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Web Page Url</label>
                                        <input type="text" className="form-control" placeholder="Enter a web page url" name="pageUrl" onChange={this.handleInputChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.importFromWebPage} data-dismiss="modal">Import</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="importfromFile" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload media file</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Media File</label>
                                        <input type="file" className="form-control-file" onChange={this.mediaFileChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.uploadMediaFile}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="importfromZip" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload zip file</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Media Zip File</label>
                                        <input type="file" className="form-control-file" onChange={this.mediaZipChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.uploadMediaZipFile}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default privateRoute(StoreMedias);