import React from 'react';
import {connect} from "react-redux";
import {login} from "../../redux/auth-reducer";
import { Form } from 'antd';
import 'antd/dist/antd.css';
import LoginForm from "./LoginForm";
import css from './Login.module.css'
import {Redirect} from "react-router-dom";
import {compose} from "redux";

const LoginContainer = (props) => {

    const {getFieldDecorator, validateFields} = props.form;

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {
                props.login(values.username, values.password);
            }
        });
    };

    return (
        <div className={css.outer}>
            {props.isAuth && <Redirect to={'/'} />}

            <LoginForm {...props}
                       getFieldDecorator={getFieldDecorator}
                       onSubmit={onSubmit}
            />
        </div>
    )
};

const Login = Form.create({ name: 'login_form',  })(LoginContainer);

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    loginErrors: state.auth.loginErrors
});

export default compose(
    connect(mapStateToProps, {login}),
)(Login);
