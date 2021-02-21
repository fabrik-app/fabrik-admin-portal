import React, { Component } from 'react';
import Link from 'next/link';
import { config } from '../config';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <React.Fragment>
            <div className="py-3 bg-primary text-white">
                <div className="container">
                    <div className="row">
                        <div className="col text-center text-md-left">
                            <p className="mb-0">&copy; {new Date().getFullYear()} {config.appName}. All rights reserved. </p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default Footer;