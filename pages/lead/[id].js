import * as React from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import LabelControl from '../../components/labelControlComponent';
import IconControl from '../../components/iconControlComponent';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';
import BusyIndicator from '../../components/busyIndicator';

class LeadDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
        };

        this.removeItem = this.removeItem.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'leads/' + props.query.id;

        const selectedLead = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });


        return {
            auth: props.auth,
            data: selectedLead.data
        }
    }

    removeItem() {
        var r = confirm("Are you sure, you want to delete this Lead");
        if (r == true) {
            var leadDeleteApiEndpoint = config.apiBaseUrl + 'leads/' + this.props.data.id;
            axios.delete(leadDeleteApiEndpoint, {
                headers: { Authorization: `Bearer ${props.auth.token}` }
            })
                .then(apiResult => {
                    toast("Lead deleted Successfully");
                    window.history.back();
                })
                .catch(error => alert(error));
        }
    }

    render() {
        let content;
        if (this.state.isBusy) {
            content = <BusyIndicator message="Loading Lead Details"/>;
        }
        else {
            const devicesList = this.props.data.devices.map((device, index) => {
                return (
                    <div className="col-sm-12 col-lg-6 mt-5" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{device.deviceFamily}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{device.userAgentRaw}</h6>
                            </div>
                        </div>
                    </div>);
            });

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                        <li className="breadcrumb-item"><Link href="/leads"><a>Leads</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{this.props.data.name}</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md">
                        <div className="d-flex justify-content-end">
                            <div className="btn-group" role="group">
                                <Link href={{ pathname: '/analytics/leads/' + this.props.data.id, search: '?name=' + this.props.data.name }}>
                                    <a role="button" className="btn btn-primary"> Analytics</a>
                                </Link>
                                <a role="button" className="btn btn-danger mr-2" onClick={this.removeItem}> Delete</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <h1 className="my-4">
                        {this.props.data.name}<span className="badge badge-success ml-3">{this.props.data.score}</span>
                    </h1>
                    <div className="row">
                        <div className="col-md-8">
                            <h4>Devices</h4>
                            <div className="row">
                                {devicesList}
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Stats</h5>
                                    <div className="card-text">
                                        <ul className="list-unstyled">
                                            <li title="Visits"><i className="far fa-eye" /> <LabelControl value={this.props.data.visits} /></li>
                                            <li title="Score"><i className="fas fa-star" /> <LabelControl value={this.props.data.score} /></li>
                                            <li title="Last Visit"><i className="fas fa-calendar" />&nbsp;<Moment fromNow>{this.props.data.createdOn}</Moment></li>
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

export default privateRoute(LeadDetails);