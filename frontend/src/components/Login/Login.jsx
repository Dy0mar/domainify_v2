import React from 'react';
import {connect} from "react-redux";
import {login} from "../../redux/auth-reducer";
import { Form } from 'antd';
import 'antd/dist/antd.css';
import LoginForm from "./LoginForm";

const Login = (props) => {

    const {getFieldDecorator, validateFields} = props.form;

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {
                props.login(values.email, values.password);
            }
        });
    };

    return (
        <LoginForm {...props}
                   getFieldDecorator={getFieldDecorator}
                   onSubmit={onSubmit}
        />
    )
};

const LoginComponent = Form.create({ name: 'normal_login',  })(Login);

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
});

export default connect(mapStateToProps, {login})(LoginComponent);
