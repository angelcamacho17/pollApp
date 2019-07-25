import React, { Component } from 'react';
import '../poll/Poll.css';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

class Thought extends Component {

    render() {
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.thought.createdBy.username}`}>
                            <Avatar className="poll-creator-avatar"
                                    style={{ backgroundColor: getAvatarColor(this.props.thought.createdBy.name)}} >
                                {this.props.thought.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                {this.props.thought.createdBy.name}
                            </span>
                            <span className="poll-creator-username">
                                @{this.props.thought.createdBy.username}
                            </span>
                            <span className="poll-creation-date">
                                {formatDateTime(this.props.thought.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="poll-question">
                        {this.props.thought.message}
                    </div>
                </div>
            </div>
        );
    }
}


export default Thought;