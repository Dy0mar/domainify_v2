import React from 'react'
import {Col, Divider, Form, Row} from 'antd';
import "antd/dist/antd.css";

import {compose} from "redux";
import {withAuthRedirect} from "../../../hoc/withAuthRedirect";
import {createStatus} from "../../../redux/task-reducer";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {submitCreateUpdateForm} from "../../../utils/utils";
import StatusForm from "./StatusForm";


const StatusCreateContainer = (props) => {
    const {getFieldDecorator, validateFields} = props.form;
    const {formErrors, status, createStatus} = props;


    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, createStatus);
    };

    const _props = {getFieldDecorator, onSubmit, formErrors, status};
    return (
        <div>
            <Divider>Status create</Divider>
            <Row>
                <Col span={24}>
                    <StatusForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    formErrors: state.tasks.formErrors,
});

const StatusCreateComponent = Form.create({ name: 'status_create_form',  })(StatusCreateContainer);

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {createStatus})
)(StatusCreateComponent);
