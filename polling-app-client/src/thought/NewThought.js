import React, { Component } from 'react';
import { createThought} from '../util/APIUtils';
import '../poll/NewPoll.css';
import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input

class NewThought extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {
                text: ''
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const thoughtData = {
            message: this.state.message.text
        };

        createThought(thoughtData)
            .then(response => {
                this.props.history.push("/");
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

    render() {

        return (

            <div className="new-poll-container">

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
            </div>
        );
    }
}

export default NewThought;