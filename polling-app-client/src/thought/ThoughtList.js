import React, { Component } from 'react';
import { getAllThoughts, getUserCreatedThoughts} from '../util/APIUtils';
import Thought from './Thought';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon } from 'antd';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import '../poll/PollList.css';

class ThoughtList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thoughts: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadThoughtList= this.loadThoughtList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadThoughtList(page = 0, size = POLL_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_THOUGHTS') {
                promise = getUserCreatedThoughts(this.props.username, page, size);
            }
        } else {
            promise = getAllThoughts(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const thoughts = this.state.thoughts.slice();

                this.setState({
                    thoughts: thoughts.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
        this.loadThoughtList();
    }

    componentWillUnmount() {
        this.loadThoughtList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                thoughts: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadThoughtList();
        }
    }

    handleLoadMore() {
        this.loadThoughtList(this.state.page + 1);
    }

    render() {
        const thoughtViews = [];
        this.state.thoughts.forEach((thought, thoughtIndex) => {
            thoughtViews.push(<Thought
                key={thought.id}
                thought={thought}/>)
        });

        return (
            <div id={'thoughtList'} className="polls-container">
                {thoughtViews}
                {
                    !this.state.isLoading && this.state.thoughts.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Thoughts Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
            </div>
        );
    }
}

export default withRouter(ThoughtList);