import * as React from 'react';
export default class IconControl extends React.Component {
    render() {
        if (!this.props.value) {
            return null;
        }

        return (
            <a href={this.props.value} target="_blank"><i className={this.props.icon} /></a>
        );
    }
}