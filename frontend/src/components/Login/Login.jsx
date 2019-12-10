import React from 'react';
import {connect} from "react-redux";
import {login} from "../../redux/auth-reducer";
import { Form } from 'antd';
import 'antd/dist/antd.css';
import LoginForm from "./LoginForm";
import {Redirect} from "react-router-dom";

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
        <div>
        {props.isAuth
            ? <Redirect to='/' />
            : <LoginForm {...props}
                   getFieldDecorator={getFieldDecorator}
                   onSubmit={onSubmit}
            />
        }
        </div>
    )
};

const LoginComponent = Form.create({ name: 'normal_login',  })(Login);

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
});

export default connect(mapStateToProps, {login})(LoginComponent);
