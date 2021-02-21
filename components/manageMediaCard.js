import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Ripples from 'react-ripples';
import { config } from '../config';

class ManageMediaCard extends React.Component {
    constructor(props){
        super(props);

        this.deleteMedia = this.deleteMedia.bind(this);
        this.makePrimary = this.makePrimary.bind(this);
    }

    deleteMedia(){
        var that = this;
        var r = confirm("Are you sure, you want to delete this Media");
        if (r == true) {
            var mediaDeleteApiEndpoint = config.apiBaseUrl + 'medias/' + that.props.id;
            axios.delete(mediaDeleteApiEndpoint, {
                headers: { Authorization: `Bearer ${that.props.auth.token}` }
            })
            .then(apiResult => {
                alert("Media deleted Successfully");
            })
            .catch(error => alert(error));
        }
    }

    makePrimary(){
        var that = this;
        var r = confirm("Are you sure, you want to set as the Primary Image");
        if (r == true) {
            var changeStoreImageAsPrimaryEndpoint = config.apiBaseUrl + 'stores/' + that.props.storeSlug + "/medias/" + this.props.id + "/primary";
            axios.put(changeStoreImageAsPrimaryEndpoint, {}, {
                headers: { Authorization: `Bearer ${that.props.auth.token}` }
            })
            .then(apiResult => {
                alert("Image set as Primary Image");
            })
            .catch(error => alert(error));
        }
    }

    render(){
        const primaryImage = this.props.image ? "https://imgs.fabrik.in/5456734/fill/400/400/sm/0/plain/https://fabrik.sgp1.digitaloceanspaces.com/images/" + this.props.image : "https://dummyimage.com/355x266/563d7c/ffffff&text=" + this.props.name;
        var showPrimary = this.props.storeSlug != null ? true: false;
        return (
            <div className="card item-card">
                <Ripples>
                    <Link href={'/media/' + this.props.slug}>
                        <a>
                            <img src={primaryImage} className="media-card-image" alt={this.props.name} />
                        </a>
                    </Link>
                </Ripples>
                <div className="card-body">
                    <a onClick={this.deleteMedia}>
                        <i className="fas fa-trash" />
                    </a>
                    &nbsp;&nbsp;
                    {showPrimary == true &&
                        <a onClick={this.makePrimary}>
                            <i className="fas fa-home" />
                        </a>
                    }
                    <span className="badge badge-primary card-rating float-right">{this.props.rating}</span>
                </div>
            </div>
        );
    }
}

export default ManageMediaCard;