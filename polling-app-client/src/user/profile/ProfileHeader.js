import React, { Component } from 'react';
import './Profile.css';
import {Icon, Dropdown} from 'antd';
import NewPoll from '../../poll/NewPoll';
import ReactDOM from 'react-dom';
import NewThought from '../../thought/NewThought';
import {
    Link
} from 'react-router-dom';
import { Layout, Menu } from 'antd';
const Header = Layout.Header;

class ProfileHeader extends Component {
    constructor(props){
        super(props);
        this.state={
            newPoll:true,
            newThought:false
        }
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick({ key }) {
        if(key === "newPoll") {
            let newP = ReactDOM.render(<NewPoll {...this.props}/>,document.getElementById('dumm') );
        }
        if(key === "newThought") {
            let newT = ReactDOM.render(<NewThought {...this.props}/>,document.getElementById('dumm2') );
        }

    }

    render() {
        return (
            <Header className="app-header">
                <div id={"dumm"}></div>
                <div id={"dumm2"}></div>
            <div className="container">
              <div className="app-title" >
                <Link to="/">{this.props.currentUser.name}</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                onClick={this.handleMenuClick}
                style={{ lineHeight: '64px' }} >
                  <Menu.Item key="newPoll" className="dropdown-item" >
                      New poll
                  </Menu.Item>
                  <Menu.Item key="newThought" className="dropdown-item" >
                      New Thought
                  </Menu.Item>
              </Menu>
            </div>
          </Header>
        );
    }
}

export default ProfileHeader;