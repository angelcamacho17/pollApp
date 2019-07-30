import React, { Component } from 'react';
import PollList from '../../poll/PollList';
import ThoughtList from '../../thought/ThoughtList';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar, Tabs, Layout } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import ProfileHeader from './ProfileHeader';

const { Content, Sider, Drawer } = Layout;

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        <Layout className="app-container">
                            <Sider breakpoint="xs"
                                   collapsedWidth="5px"
                                   style={{marginLeft:'-30px'}}
                            >
                            <ProfileHeader isAuthenticated={this.state.isAuthenticated}
                            currentUser={this.state.user} 
                            onLogout={this.handleLogout} {...this.props} />
                            </Sider>
                        <Content >
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">@{this.state.user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(this.state.user.joinedAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="user-poll-details">    
                                <Tabs defaultActiveKey="1" 
                                    animated={false}
                                    tabBarStyle={tabBarStyle}
                                    size="large"
                                    className="profile-tabs">
                                    <TabPane tab={`${this.state.user.pollCount} Polls`} key="1">
                                        <PollList username={this.props.match.params.username} isAuthenticated={this.props.isAuthenticated} type="USER_CREATED_POLLS" />
                                    </TabPane>
                                    <TabPane tab={`${this.state.user.voteCount} Votes`}  key="2">
                                        <PollList username={this.props.match.params.username} type="USER_VOTED_POLLS" />
                                    </TabPane>
                                    <TabPane tab={`${this.state.user.thoughtCount} Thoughts`} key="3">
                                        <ThoughtList username={this.props.match.params.username} type="USER_CREATED_THOUGHTS" />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Content>
                        </Layout>
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;