import React, { Component } from 'react';
import './Profile.css';
import { Icon } from 'antd';
import pollIcon from '../../poll.svg';
import {
    Link
} from 'react-router-dom';
import { Layout, Menu } from 'antd';
const Header = Layout.Header;

class ProfileHeader extends Component {
    constructor(props){
        super(props);
    }
    render() {
        console.log(this.props.currentUser);
        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">{this.props.currentUser.name}</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                style={{ lineHeight: '64px' }} >
                <Menu.Item key="/profile" className="profile-menu">
                    <NewDropdownMenu 
                    currentUser={this.props.currentUser} 
                    handleMenuClick={this.handleMenuClick}/>
                </Menu.Item>
              </Menu>
            </div>
          </Header>
        );
    }
}

function NewDropdownMenu(props) {
    const dropdownMenu = (
      <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
        <Menu.Item key="profile" className="dropdown-item">
          <Link to="">New poll</Link>
        </Menu.Item>
        <Menu.Item key="logout" className="dropdown-item">
          Logout
        </Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown 
        overlay={dropdownMenu} 
        trigger={['click']}
        getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
        <a className="ant-dropdown-link">
           <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
        </a>
      </Dropdown>
    );
  }

export default ProfileHeader;