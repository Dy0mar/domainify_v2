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
        handleSubmit, getFieldDecorator, validateToNextPassword, registerErrors,
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
                {...registerErrors.username && {
                    help: registerErrors.username,
                    validateStatus: 'error',
                }}
                label={
                    <span>Username&nbsp;
                        <Tooltip title="What do you want others to call you?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!'}],
                })(<Input />)}
            </Form.Item>

            <Form.Item
                {...registerErrors.email && {
                    help: registerErrors.email,
                    validateStatus: 'error',
                }}
                label="E-mail">
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

            <Form.Item
                {...registerErrors.password && {
                    help: registerErrors.password,
                    validateStatus: 'error',
                }}
                label="Password" hasFeedback>
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
                {...registerErrors.jabber_nick && {
                    help: registerErrors.jabber_nick,
                    validateStatus: 'error',
                }}
                label={
                    <span>
                        Jabber nick&nbsp;
                        <Tooltip title="What is your jabber_nick( username@im.dungeon.cave )?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
                {getFieldDecorator('jabber_nick', {
                    rules: [{ required: true, message: 'Please input your jabber nick!' }],
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