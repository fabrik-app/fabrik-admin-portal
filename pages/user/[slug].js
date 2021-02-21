import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import LabelControl from '../../components/labelControlComponent';
import IconControl from '../../components/iconControlComponent';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';
import BusyIndicator from '../../components/busyIndicator';

class UserDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            data: props.data
        };

        this.removeItem = this.removeItem.bind(this);
        this.pushMessage = this.pushMessage.bind(this);
    }

    static async getInitialProps(props) {

        var dataApiEndpoint = config.apiBaseUrl + 'users/' + props.query.slug;

        const apiResult = await axios.get(dataApiEndpoint, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        if (!apiResult.data.devices) {
            apiResult.data.devices = [];
        }

        return {
            auth: props.auth,
            data: apiResult.data
        }
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this User");
        if (r == true) {
            var deleteDataApiEndpoint = config.apiBaseUrl + 'users/' + this.props.data.id;
            axios.delete(deleteDataApiEndpoint, {
                headers: { Authorization: `Bearer ${props.auth.token}` }
            })
                .then(apiResult => {
                    alert("User deleted Successfully");
                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    pushMessage() {
        var r = confirm("Are you sure, you want to push message this User");
        if (r == true) {

            var message = {
                isPublic: false,
                userId: this.props.data.id,
                message: "This is a test message from Fabrik Notification",
                type: "text"
            };

            var pushNotificationEndpoint = config.apiBaseUrl + 'notifications/push';
            axios.post(pushNotificationEndpoint, message, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    alert("Push Message sent Successfully");
                })
                .catch(error => alert(error));
        }
    }

    render() {
        const devicesList = this.props.data.devices.map((device, index) => {
            if(device.device){
                return (
                    <div className="col-sm-12 col-lg-6 mt-5" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">{device.device.idiom}</h6>
                                <p className="card-subtitle mb-2 text-muted">{device.device.name}</p>
                            </div>
                        </div>
                    </div>);
            }
        });

        let content;
        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading User details"/>;
        }
        else {
            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/users"><a>Users</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.state.data.name}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <Link href={{ pathname: '/user/' + this.state.data.slug + '/edit' }}>
                                    <a role="button" className="btn btn-primary"> Edit</a>
                                </Link>
                                <Link href={{ pathname: '/user/' + this.state.data.slug + '/resetPassword' }}>
                                    <a role="button" className="btn btn-primary"> Reset Password</a>
                                </Link>
                                <a role="button" className="btn btn-primary" onClick={this.pushMessage}> Push</a>
                                <a role="button" className="btn btn-danger" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container my-5">
                    <div className="row">
                        <div className="col-md-8">
                            <h3 className="my-3">{this.state.data.name}</h3>
                            <h4>Devices - {this.state.data.devices.length}</h4>
                            <div className="row">
                                {devicesList}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Details</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Source">&nbsp;<i className="fas fa-mobile"/> &nbsp;<LabelControl value={this.state.data.source} /></li>
                                            <li title="Country"><i className="fas fa-star"/>&nbsp;<LabelControl value={this.state.data.country} /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}

export default privateRoute(UserDetails);