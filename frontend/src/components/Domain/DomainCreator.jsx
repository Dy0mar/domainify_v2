import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import DomainForm from "./DomainForm";


const DomainCreateContainer = (props) => {
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
        <div>
            <Divider>Domain create</Divider>
            <DomainForm {...props}
                        onSubmit={onSubmit}
                        getFieldDecorator={getFieldDecorator}
            />
        </div>
    )
};

const DomainCreateComponent = Form.create({ name: 'login_form',  })(DomainCreateContainer);

const mapStateToProps = (state) => ({
    createFormErrors: state.domains.createFormErrors
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps)
)(DomainCreateComponent);
