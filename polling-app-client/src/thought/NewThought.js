import React, { Component } from 'react';
import { createThought} from '../util/APIUtils';
import '../poll/NewPoll.css';
import { Form, Input, Button, notification, Modal } from 'antd';
import {browserHistory} from "react-router";
import ReactDOM from "react-dom";
import Profile from "../user/profile/Profile";
import ThoughtList from './ThoughtList';
const FormItem = Form.Item;
const { TextArea } = Input;

class NewThought extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {
                text: ''
            },
            visible:false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    showModal(){
        this.setState({
            visible: true,
        });
    }

    handleOk(){
        this.setState({
            visible: false,
        });
        this.props.unmountMe();
    }

    handleCancel(){
        this.setState({
            visible: false,
        });
        this.props.unmountMe();
    }

    handleSubmit(event) {
        event.preventDefault();
        const thoughtData = {
            message: this.state.message.text
        };

        createThought(thoughtData)
            .then(response => {
                notification.success({
                    message: 'New Thought',
                    description: "The thought was successfully created",
                });
            }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create thought.');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
        this.handleOk();
    }

    handleMessageChange(event) {
        const value = event.target.value;
        this.setState({
            message: {
                text: value
            }
        });
    }


    isFormInvalid() {
        if(this.state.message.text !== '') {
            return false;
        }
        return true;
    }

    componentDidMount() {
        this.showModal();
    }

    render() {

        return (

            <Modal
                title="New Thought"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <h1 className="page-title">Create Thought</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                        <FormItem validateStatus={this.state.message.validateStatus}
                                  help={this.state.message.errorMsg} className="poll-form-row">
                            <TextArea
                                placeholder="What are you thinking?"
                                style = {{ fontSize: '16px' }}
                                autosize={{ minRows: 3, maxRows: 6 }}
                                name = "message"
                                value = {this.state.message.text}
                                onChange = {this.handleMessageChange} />
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={this.isFormInvalid()}
                                    className="create-poll-form-button">Share</Button>
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default NewThought;