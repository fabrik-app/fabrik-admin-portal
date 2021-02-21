import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {config} from '../../../config';
import moment from 'moment';
import DateTime from 'react-datetime';

export default class AddEditPostComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: true,
            pageTitle: "Create new Post",
            post: {
                id: null,
                category: "",
                title: "",
                previewContent: "",
                content: "",
                seo: {
                    title: "",
                    description: "",
                    keywords: ""
                },
                tags: [],
            },
            metaTitleCharCount: 0,
            metaDescriptionCharCount: 0,
            metaKeywordsCharCount: 0,
            tags: [
                { text: 'Fabrik', checked: false },
                { text: 'Designers', checked: false },
                { text: 'Boutiques', checked: false }
            ]
        };  

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleTelephoneNumber = this.handleTelephoneNumber.bind(this);
        this.handleMetaTitle = this.handleMetaTitle.bind(this);
        this.handleMetaDescription = this.handleMetaDescription.bind(this);
        this.handleMetaKeywords = this.handleMetaKeywords.bind(this);
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

    componentDidMount() {
        if (this.props.match.url != '/post/new') {
            var postId = this.props.match.params.postId;
            this.setState({ id: postId, pageTitle: "Update Post" });

            var apiEndpoint = appConfig.apiBaseUrl + 'post/' + postId;
            axios.get(apiEndpoint)
                .then(apiResult => {

                    // This may be null for older entities, so adding a null check
                    if (!apiResult.data.seo) {
                        apiResult.data.seo = {
                            title: "",
                            description: "",
                            keywords: ""
                        }
                    }
                    else {

                        var metaTitleLength = 60;
                        if (apiResult.data.seo.title) {
                            metaTitleLength = 60 - apiResult.data.seo.title.length;
                        }

                        var metaDescriptionLength = 160;
                        if (apiResult.data.seo.description) {
                            metaDescriptionLength = 160 - apiResult.data.seo.description.length;
                        }

                        var metaKeywordsLength = 200;
                        if (apiResult.data.seo.keywords) {
                            metaKeywordsLength = 200 - apiResult.data.seo.keywords.length;
                        }

                        this.setState({
                            metaTitleCharCount: metaTitleLength,
                            metaDescriptionCharCount: metaDescriptionLength,
                            metaKeywordsCharCount: metaKeywordsLength
                        });
                    }

                    var modes = this.state.tags;

                    if (apiResult.data.tags) {

                        for (var i = 0; i < modes.length; i++) {
                            if (apiResult.data.tags.includes(modes[i].text)) {
                                modes[i].checked = true;
                            }
                            else {
                                modes[i].checked = false;
                            }
                        }
                    }

                    this.setState({
                        post: apiResult.data,
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

    handleTagChanged(index, e) {

        let newItems = this.state.tags.slice();
        newItems[index].checked = !newItems[index].checked

        this.setState({
            tags: newItems
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var currentTags = this.state.tags.filter(m => m.checked === true);
        this.state.post.tags = currentTags.map(m => m.text);

        this.setState({
            isBusy: true
        });

        if (this.state.post.id == null) {
            var createPostUrl = appConfig.apiBaseUrl + 'post/new';
            axios.post(createPostUrl, this.state.post)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Post created Successfully");

                    window.history.back();
                })
                .catch(error => alert(error));
        }
        else {
            var updatePostUrl = appConfig.apiBaseUrl + 'post/' + this.state.post.id;
            axios.put(updatePostUrl, this.state.post)
                .then(apiResult => {

                    this.setState({
                        isBusy: false
                    });

                    toast("Post updated Successfully");

                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    render() {

        let content;

        if (this.state.isBusy) {
            content = <div>Loading Post Details</div>;
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
                                    name="post.title"
                                    value={this.state.post.title}
                                    onChange={this.handleInputChange}
                                    required />
                            </div>
                            <div className="form-group col-md-4">
                                <label>Category</label>
                                <select id="post.category"
                                    name="post.category"
                                    value={this.state.post.category}
                                    onChange={this.handleInputChange}
                                    className="form-control">
                                    <option>Please select Category</option>
                                    <option value="Boutique">General</option>
                                    <option value="Boutique">Fashion</option>
                                    <option value="Boutique">Boutique</option>
                                    <option value="Boutique">Designer</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Preview Content</label>
                                <textarea id="previewContent"
                                    name="post.previewContent"
                                    className="form-control"
                                    value={this.state.post.previewContent}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Content</label>
                                <textarea id="content"
                                    name="post.content"
                                    className="form-control"
                                    value={this.state.post.content}
                                    onChange={this.handleInputChange}
                                    rows="5"
                                    required />
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
                                    name="post.slug"
                                    value={this.state.post.slug}
                                    onChange={this.handleInputChange}
                                    className="form-control" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Title</label>
                                <input id="sEO.Title"
                                    name="post.seo.title"
                                    value={this.state.post.seo.title}
                                    onChange={this.handleMetaTitle}
                                    className="form-control" />
                                <p>Characters Left: {this.state.metaTitleCharCount}</p>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meta Description</label>
                                <textarea id="sEO.Description"
                                    name="post.seo.description"
                                    value={this.state.post.seo.description}
                                    onChange={this.handleMetaDescription}
                                    className="form-control"
                                    rows={4}
                                />
                                <p>Characters Left: {this.state.metaDescriptionCharCount}</p>
                            </div>
                            <div className="form-group col-md-6">
                                <label>Meta Keywords</label>
                                <textarea id="sEO.Keywords"
                                    name="post.seo.keywords"
                                    className="form-control"
                                    value={this.state.post.seo.keywords}
                                    onChange={this.handleMetaKeywords}
                                    rows={4} />
                                <p>Characters Left: {this.state.metaKeywordsCharCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <h4>Tags</h4>
                        <hr />
                        <div className="form-row">
                            {this.state.tags.map((tag, i) =>
                                <div className="form-check form-check-inline">
                                    <input type="checkbox"
                                        name="tags"
                                        checked={tag.checked}
                                        onChange={this.handleTagChanged.bind(this, i)}
                                        className="form-check-input" />
                                    <label className="form-check-label">{tag.text}</label>
                                </div>
                            )}
                        </div>
                        <br />
                    </div>
                    <button className="btn btn-primary" >Save</button>
                </form>
            </div>;
        }

        return content;
    }
}