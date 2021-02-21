import * as React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LabelControl from '../../../components/labelControlComponent';
import {config} from '../../../config';

export default class PostDetailsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: true,
        };

        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        var postId = this.props.match.params.postId;
        this.setState({ postId: postId });

        var postDetailsApiEndpoint = appConfig.apiBaseUrl + 'post/' + postId;
        axios.get(postDetailsApiEndpoint)
            .then(apiResult => {
                if (apiResult.data) {
                    this.setState({
                        post: apiResult.data,
                        isBusy: false
                    });
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Post");
        if (r == true) {
            var postDeleteApiEndpoint = appConfig.apiBaseUrl + 'post/' + this.state.postId;
            axios.delete(postDeleteApiEndpoint)
                .then(apiResult => {
                    toast("Post deleted Successfully");
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
            content = <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link to="/post">Posts</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Details</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <Link to={{ pathname: '/post/' + this.state.postId + '/edit' }} className="btn btn-primary">Edit</Link>
                                <a role="button" className="btn btn-danger mr-2" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}