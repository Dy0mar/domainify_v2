import React, {useEffect} from 'react'
import {Col, Divider, Form, Row} from 'antd';
import "antd/dist/antd.css";

import {compose} from "redux";
import {withAuthRedirect} from "../../../hoc/withAuthRedirect";
import {getCodeDetail, updateCode} from "../../../redux/task-reducer";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {submitCreateUpdateForm} from "../../../utils/utils";
import CodeForm from "./CodeForm";


const CodeEditContainer = (props) => {
    const {codeId} = props.match.params;
    const {getFieldDecorator, validateFields} = props.form;
    const {formErrors, code, getCodeDetail, updateCode} = props;

    useEffect(() => {
        getCodeDetail(codeId)
    },[getCodeDetail, codeId]);

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, updateCode, code.pk);
    };

    const _props = {getFieldDecorator, onSubmit, formErrors, code};
    return (
        <div>
            <Divider>Code edit</Divider>
            <Row>
                <Col span={24}>
                    <CodeForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    formErrors: state.tasks.formErrors,
    code: state.tasks.code,
});

const CodeEditComponent = Form.create({ name: 'code_edit_form',  })(CodeEditContainer);

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {updateCode, getCodeDetail})
)(CodeEditComponent);
