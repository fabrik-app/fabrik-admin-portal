import * as React from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../../config';
import { privateRoute } from '../../privateRoute';

class Templates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            isBusy: false
        };
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'templates';

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            auth: props.auth,
            data: apiResult.data,
        }
    }

    render() {
        const templatesList = this.state.data.map((selectedData, index) => {
            var primaryImage;
            if (selectedData.primaryImage) {
                primaryImage = "https://imgs.fabrik.in/5456734/fill/400/400/ce/0/plain/" + selectedData.primaryImage.url;
            } else {
                primaryImage = "https://dummyimage.com/355x266/563d7c/ffffff&text=" + selectedData.name;
            }
            return (
                <div className="col-sm-12 col-lg-4 mt-5" key={index}>
                    <div className="card">
                            <div className="card-labels">
                                <span className="ratingBadge">{selectedData.Rating}</span>
                            </div>
                            <Link href={'/settings/template/' + selectedData.id + '/edit'}>
                                <a>
                                    <img className="card-img-top" src={primaryImage} alt={selectedData.title} />
                                </a>
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">{selectedData.title}</h5>
                                <h5 className="float-right"><span className="badge badge-primary">{selectedData.rating}</span></h5>
                            </div>
                        </div>
                </div>);
        });
        let content;

        if (this.state.isBusy) {
            content = <div>Loading Templates</div>;
        }
        else {

            content = <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">
                                <a>Dashboard</a>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">Settings</li>
                        <li className="breadcrumb-item active" aria-current="page">Templates</li>
                    </ol>
                </nav>
                <h1>Manage Templates</h1>
                <hr />
                <div className="row">
                    <div className="col-md-3 offset-9">
                        <div className="d-flex justify-content-end">
                            <a href="/settings/template/new" className="btn btn-primary mb-2">Create</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {templatesList}
                </div>
            </div>
        }

        return content;
    }
}

export default privateRoute(Templates);