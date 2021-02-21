import * as React from 'react';
export default class SelectorModal extends React.Component {

    constructor(props) {
        super(props);
        this.handleCloseClick = this.handleCloseClick.bind(this);
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('show');
        $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('hide');
        handleModalCloseClick();
    }

    render() {
        return (
            <div>
                <div className="modal fade" ref={modal => this.modal = modal} id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Select Designer</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h5 className="text-center">Hello. Some text here.</h5>
                                <table className="table table-striped" id="tblGrid">
                                    <thead id="tblHead">
                                        <tr>
                                            <th>Location</th>
                                            <th>Points</th>
                                            <th className="text-right">Mean</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>Long Island, NY, USA</td>
                                            <td>3</td>
                                            <td className="text-right">45001</td>
                                        </tr>
                                        <tr><td>Chicago, Illinois, USA</td>
                                            <td>5</td>
                                            <td className="text-right">76455</td>
                                        </tr>
                                        <tr><td>New York, New York, USA</td>
                                            <td>10</td>
                                            <td className="text-right">39097</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="form-group">
                                    <input type="button" className="btn btn-warning btn-sm pull-right" value="Reset" />
                                    <div className="clearfix">
                                        </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.handleCloseClick}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}