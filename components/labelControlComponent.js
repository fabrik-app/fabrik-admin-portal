import * as React from 'react';
export default class LabelControl extends React.Component {
    render() {
        if (!this.props.value) {
            return "Not Specified";
        }

        return (
            this.props.value
        );
    }
}