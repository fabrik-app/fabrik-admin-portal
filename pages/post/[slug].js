import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import LabelControl from '../../components/labelControlComponent';
import {config} from '../../config';
import { privateRoute } from '../../privateRoute';

class PostDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            isBusy: false,
        };

        this.removeItem = this.removeItem.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'posts/' + props.query.slug;

        const selectedData = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        var data = selectedData.data;
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

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Post");
        if (r == true) {
            var postDeleteApiEndpoint = appConfig.apiBaseUrl + 'post/' + this.state.data.id;
            axios.delete(postDeleteApiEndpoint)
                .then(apiResult => {
                    alert("Post deleted Successfully");
                    window.history.back();
                })
                .catch(error => {
                    alert(error);
                });
        }
    }

    render() {
        let content;
        if (this.state.isBusy) {
            content = <div>Loading Post Details</div>;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/posts"><a>Posts</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.state.data.title}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <Link href={{ pathname: '/post/' + this.state.data.slug + '/edit' }}>
                                    <a role="button" className="btn btn-primary"> Edit</a>
                                </Link>
                                <a role="button" className="btn btn-danger" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}

export default privateRoute(PostDetails);