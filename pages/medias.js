import { NextSeo } from 'next-seo';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { config } from '../config';
import dynamic from "next/dynamic";
import ManageMediaCard from '../components/manageMediaCard';
import InfiniteScroll from 'react-infinite-scroller';
const Image = dynamic(() => import('react-graceful-image'), { ssr: false });
import { privateRoute } from '../privateRoute';

class Medias extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sort: props.sort,
            data: props.data,
            pagingInfo: props.pagingInfo,
        }

        this.loadNextData = this.loadNextData.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    static async getInitialProps(props) {

        var apiUrl = config.apiBaseUrl + 'medias/all?sort=latest';

        const apiResult = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${props.auth.token}` }
        });

        return {
            sort: "latest",
            auth: props.auth,
            data: apiResult.data.items,
            pagingInfo: apiResult.data.pagingInfo
        }
    }

    handleSortChange(e) {
        var that = this;
        var thatVal = e.target.value;
        this.setState({
            sort: thatVal,
            pagingInfo: {
                currentPage: 1
            }
        }, () => {
            that.loadPage();
        });
    }

    loadPage() {
        this.setState({
            isBusy: true
        }, () => {
            var storesApiEndpoint = config.apiBaseUrl + 'medias/all?page=' + this.state.pagingInfo.currentPage + '&sort=' + this.state.sort;
            axios.get(storesApiEndpoint, {
                headers: { Authorization: `Bearer ${this.props.auth.token}` }
            })
                .then(apiResult => {
                    this.setState({
                        data: apiResult.data.items,
                        pagingInfo: apiResult.data.pagingInfo,
                        isBusy: false,
                        isLoading: false
                    });
                })
                .catch(error => {
                    this.setState({
                        isLoading: false
                    });
                    
                    alert(error);
                });
        });
    }

    async loadNextData() {

        var that = this;
        var nextPage = that.state.pagingInfo.currentPage + 1;
        var searchApiUrl = config.apiBaseUrl + 'medias/all?page=' + nextPage + "&pageSize=" + that.state.pagingInfo.itemsPerPage;

        const res = await fetch(searchApiUrl);
        const data = await res.json();
        await that.setState({
            data: that.state.data.concat(data.items),
            pagingInfo: data.pagingInfo
        });
    }

    render() {
        var that = this;
        var mediasList = this.state.data.map(function (media, i) {
            return (<div className="col-md-4 col-sm-6 mt-3" key={i}>
                <ManageMediaCard slug={media.slug} image={media.name} rating={media.views} id={media.id} auth={that.props.auth} />
            </div>
            )
        });

        return (
            <div>
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><a>Dashboard</a></Link></li>
                            <li className="breadcrumb-item active" aria-current="page"><a>Medias</a></li>
                        </ol>
                    </nav>
                    <h1>Manage Medias</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-3">
                            <div className="d-flex justify-content-start">
                                <select id="sort"
                                    name="sort"
                                    value={this.state.sort}
                                    onChange={this.handleSortChange}
                                    className="form-control">
                                    <option>Please select Sort</option>
                                    <option value="latest">Latest</option>
                                    <option value="rating">Rating</option>
                                    <option value="views">Views</option>
                                </select>
                            </div>
                        </div>
                        {/* <div className="col-md-3">
                            <div className="d-flex justify-content-start">
                                <select id="publishedState"
                                    name="publishedState"
                                    value={this.state.publishedState}
                                    onChange={this.handlePublishedStateChange}
                                    className="form-control">
                                    <option>Please select Published State</option>
                                    <option value="published">Published</option>
                                    <option value="unpublished">UnPublished</option>
                                    <option value="all">All</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 offset-9">
                            <div className="d-flex justify-content-end">
                                <a href="/store/new" className="btn btn-primary mb-2">Create</a>
                            </div>
                        </div> */}
                    </div>
                    <div className="row my-5">
                        <div className="col-md-12">
                            <InfiniteScroll
                                pageStart={this.state.pagingInfo.currentPage}
                                loadMore={this.loadNextData}
                                hasMore={this.state.pagingInfo.hasNextPage}
                                loader={<div className="loader" key={0}>Loading more Medias...</div>}>
                                <div className="row">
                                    {mediasList}
                                </div>
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default privateRoute(Medias);