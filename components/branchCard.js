import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Ripples from 'react-ripples';
import { config } from '../config';
import NotificationManager from '../services/notificationManager';

class BranchCard extends React.Component {
    constructor(props){
        super(props);

        this.deleteBranch = this.deleteBranch.bind(this);
    }

    deleteBranch(){
        var that = this;
        var r = confirm("Are you sure, you want to delete this Store Branch");
        if (r == true) {
            var apiEndpoint = config.apiBaseUrl + 'stores/' + that.props.storeSlug + '/branches/' + that.props.branch.id;
            axios.delete(apiEndpoint, {
                headers: { Authorization: `Bearer ${that.props.auth.token}` }
            })
            .then(apiResult => {
                NotificationManager.alert("Branch deleted Successfully");
                window.location.reload();
            })
            .catch(error => alert(error));
        }
    }

    render(){
        var that = this;
        return (
            <div className="card">
                <div className="card-body">
                    <Link href={'/store/' + that.props.storeSlug + '/branch/' + that.props.branch.id + "/edit" + '?name=' + that.props.storeName}>
                        <a>
                            <p>{that.props.branch.name}</p>
                        </a>
                    </Link>
                    <h6 className="card-subtitle mb-2 text-muted">{that.props.branch.address.city}</h6>
                    <p>{that.props.branch.address.state}</p>
                    <a onClick={this.deleteBranch}>
                        <i className="fas fa-trash float-right" />
                    </a>
                </div>
            </div>
        );
    }
}

export default BranchCard;