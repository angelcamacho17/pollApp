import React, { Component } from 'react';
import './Profile.css';
import NewPoll from '../../poll/NewPoll';
import ReactDOM from 'react-dom';
import NewThought from '../../thought/NewThought';
import {
    Link
} from 'react-router-dom';
import { Layout, Menu, Icon} from 'antd';
const { SubMenu } = Menu;
const { Header } = Layout;

class ProfileHeader extends Component {
    constructor(props){
        super(props);
        this.state={
            newPoll:false,
            newThought:false
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handlePollUnmount = this.handlePollUnmount.bind(this);
        this.handleThoughtUnmount = this.handleThoughtUnmount.bind(this);
    }

    handlePollUnmount(){
        this.setState({
            newPoll: false,
        });
        console.log(this.props);
        this.props.refreshThis();
    }
    handleThoughtUnmount(){
        this.setState({
            newThought: false,
        });
        this.props.refreshThis();
    }

    handleMenuClick({ key }) {
        console.log(key);
        if(key === "newPoll") {
            this.setState({
                newPoll: true,
            });
        }
        if(key === "newThought") {
            this.setState({
                newThought: true,
            });
        }

        this.render();
    }

    render() {
        console.log("poll:"+this.state.newPoll+"tho:"+this.state.newThought);
        return (
            <Header width={200} style={{ background: '#fff' }}>
                {this.state.newPoll?<NewPoll unmountMe={this.handlePollUnmount} {...this.props}/>:null}
                {this.state.newThought?<NewThought unmountMe={this.handleThoughtUnmount} {...this.props}/>:null}
                <Menu
                    className="app-menu"
                    onClick={this.handleMenuClick}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: 150, borderRight: 0 }}
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                    <Icon type="user" />
                                {this.props.currentUser.name}
                         </span>
                        }
                    >
                        <Menu.Item key="newPoll">New Poll</Menu.Item>
                        <Menu.Item  key="newThought">New Thought</Menu.Item>
                    </SubMenu>
                </Menu>
          </Header>
        );
    }
}

export default ProfileHeader;