import React from 'react'
import {Col, Divider, Form, Row} from 'antd'
import "antd/dist/antd.css"

import {compose} from "redux"
import {withAuthRedirect} from "../../../hoc/withAuthRedirect"
import {createCode} from "../../../redux/task-reducer"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"
import {submitCreateUpdateForm} from "../../../utils/utils"
import CodeForm from "./CodeForm"


const CodeCreateContainer = (props) => {
    const {getFieldDecorator, validateFields} = props.form
    const {formErrors, status, createCode} = props


    const onSubmit = (e) => {
        e.preventDefault()
        submitCreateUpdateForm(validateFields, createCode)
    }

    const _props = {getFieldDecorator, onSubmit, formErrors, status}
    return (
        <div>
            <Divider>Status create</Divider>
            <Row>
                <Col span={24}>
                    <CodeForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    formErrors: state.tasks.formErrors,
})

const StatusCreateComponent = Form.create({ name: 'code_create_form',  })(CodeCreateContainer)

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {createCode})
)(StatusCreateComponent)
