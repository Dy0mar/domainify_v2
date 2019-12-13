import React from 'react';
import 'antd/dist/antd.css';

import {
    Form,
    Input,
    Tooltip,
    Icon,
    Button,
    Divider,
} from 'antd';
import {NavLink} from "react-router-dom";


const RegistrationForm = (props) => {

    const {
        handleSubmit, getFieldDecorator, validateToNextPassword,
        compareToFirstPassword, handleConfirmBlur
    } = props;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 9 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 15 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };


    return (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
            <Divider>Register</Divider>
            <Form.Item
                label={
                    <span>
              Username&nbsp;
                        <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                }
            >
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!'}],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="E-mail">
                {getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="Password" hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password />)}
            </Form.Item>

            <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur} />)}
            </Form.Item>

            <Form.Item
                label={
                    <span>
              pidgin&nbsp;
                        <Tooltip title="What is your pidgin( username@im.dungeon.cave )?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
                }
            >
                {getFieldDecorator('pidgin', {
                    rules: [{ required: true, message: 'Please input your pidgin!' }],
                })(<Input />)}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
                </Button> Or <NavLink to="/login" activeClassName='active'>login</NavLink>
            </Form.Item>
        </Form>
    );
};

export default RegistrationForm