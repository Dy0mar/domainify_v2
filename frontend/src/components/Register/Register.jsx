import React, {useState} from 'react';
import {connect} from "react-redux";
import {register} from "../../redux/user-reducer";
import { Form } from 'antd';
import 'antd/dist/antd.css';
import RegisterForm from "./RegisterForm";
import css from './Register.module.css'
import {Redirect} from "react-router-dom";
import {compose} from "redux";

const RegisterContainer = (props) => {

    const [confirmDirty, setConfirmDirty] = useState(false);

    const {
        getFieldDecorator, validateFieldsAndScroll, getFieldValue,
        validateFields,
    } = props.form;

    const handleSubmit = e => {
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                props.register(values.username, values.email, values.password, values.jabber_nick);
            }
        });
    };

    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty({ confirmDirty: confirmDirty || !!value });
    };

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            validateFields(['confirm'], { force: true });
        }
        callback();
    };

    return (
        <div className={css.outer}>
            {props.isAuth && <Redirect to={'/'} />}

            <RegisterForm {...props}
                          getFieldDecorator={getFieldDecorator}
                          handleSubmit={handleSubmit}
                          handleConfirmBlur={handleConfirmBlur}
                          compareToFirstPassword={compareToFirstPassword}
                          validateToNextPassword={validateToNextPassword}
            />
        </div>
    )
};

const Register = Form.create({ name: 'register_form',  })(RegisterContainer);

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    registerErrors: state.user.registerErrors
});

export default compose(
    connect(mapStateToProps, {register})
)(Register);
