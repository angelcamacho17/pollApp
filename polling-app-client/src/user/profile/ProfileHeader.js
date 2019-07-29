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
            <Header width={200} style={{ background: '#fff' }}>
                <div id={"dumm"}></div>
                <div id={"dumm2"}></div>
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