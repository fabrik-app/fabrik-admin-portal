import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-toastify';
import ImageGallery from 'react-image-gallery';
import LabelControl from '../../../components/labelControlComponent';
import IconControl from '../../../components/iconControlComponent';
import TypeIconControl from '../../../components/typeIconControl';
import { config } from '../../../config';
import { privateRoute } from '../../../privateRoute';
import BusyIndicator from '../../../components/busyIndicator';
import BranchCard from '../../../components/branchCard';

class StoreBranches extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: props.data
        };
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
            storeSlug: props.query.slug,
            data: data
        }
    }

    render() {
        const { showModal } = this.state;
        var that = this;
        const branchesList = this.state.data.branches.map((branch, index) => {
            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                    <BranchCard storeName={that.props.data.name} storeSlug={that.props.storeSlug} branch={branch} auth={that.props.auth}/>
                </div>
            );
        });

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
                        <li className="breadcrumb-item active" aria-current="page"><Link href={"/store/" + this.props.storeSlug}><a>{this.state.data.name}</a></Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Branches</li>
                    </ol>
                </nav>
                <div className="row">
                    <div className="col-md-3 offset-9">
                        <div className="d-flex justify-content-end">
                            <a href={'/store/' + that.props.storeSlug + '/branch/new' + '?name=' + that.props.data.name} className="btn btn-primary mb-2">Create</a>
                        </div>
                    </div>
                </div>
                <div className="container mb-5">
                    <div className="row">
                        {branchesList}
                    </div>
                </div>
            </div>;
        }

        return content;
    }
}

export default privateRoute(StoreBranches);