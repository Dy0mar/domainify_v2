import React from "react";
import { Form, Icon, Input, Button } from 'antd';
import css from './Login.module.css'
import {NavLink} from "react-router-dom";

const LoginForm = ({onSubmit, getFieldDecorator}) => {
    return (
        <Form onSubmit={onSubmit}>
            <h1>Login</h1>
            <Form.Item>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                    />,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                    />,
                )}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={css.submitButton}>
                    Sign in
                </Button>
                Or <NavLink to="/register" activeClassName='active'>register now!</NavLink>
            </Form.Item>
        </Form>
    );
};

export default LoginForm