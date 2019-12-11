import React from 'react';
import {connect} from "react-redux";
import {register} from "../../redux/auth-reducer";
import { Form } from 'antd';
import 'antd/dist/antd.css';
import RegisterForm from "./RegisterForm";
import css from './Register.module.css'
import {Redirect} from "react-router-dom";

const Register = (props) => {

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
        <div className={css.outer}>
            {props.isAuth && <Redirect to={'/'} />}

            <RegisterForm {...props}
                       getFieldDecorator={getFieldDecorator}
                       onSubmit={onSubmit}
            />
        </div>
    )
};

const RegisterComponent = Form.create({ name: 'normal_register',  })(Register);

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
});

export default connect(mapStateToProps, {register})(RegisterComponent);
