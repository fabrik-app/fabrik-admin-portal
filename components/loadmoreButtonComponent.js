import * as React from 'react';
export default class LoadMoreButton extends React.Component {

    constructor(props) {
        super(props);
        this.loadMore = this.loadMore.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    };

    handleScroll(event) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.props.hasNextPage && !this.props.isLoading) {
            this.props.loadMore();
        }
    };

    loadMore() {
        if (!this.props.isLoading) {
            this.props.loadMore();
        }
    };

    render() {
        if (!this.props.hasNextPage) {
            return null;
        }
        else {
            return (
                <button className="btn btn-primary" onClick={this.loadMore}> {this.props.isLoading ? 'Loading': 'Load More'}</ button>
            );
        }
    }
}