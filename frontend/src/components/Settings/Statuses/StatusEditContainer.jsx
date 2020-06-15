import React, {useEffect} from 'react'
import {Col, Divider, Form, Row} from 'antd'
import "antd/dist/antd.css"

import {compose} from "redux"
import {withAuthRedirect} from "../../../hoc/withAuthRedirect"
import {getStatusDetail, updateStatus} from "../../../redux/task-reducer"
import {withRouter} from "react-router-dom"
import {connect} from "react-redux"
import {submitCreateUpdateForm} from "../../../utils/utils"
import StatusForm from "./StatusForm"


const StatusEditContainer = (props) => {
    const {statusId} = props.match.params
    const {getFieldDecorator, validateFields} = props.form
    const {formErrors, status, getStatusDetail} = props

    useEffect(() => {
        getStatusDetail(statusId)
    },[getStatusDetail, statusId])

    const onSubmit = (e) => {
        e.preventDefault()
        submitCreateUpdateForm(validateFields, props.updateStatus, status.pk)
    }

    const _props = {getFieldDecorator, onSubmit, formErrors, status}
    return (
        <div>
            <Divider>Status edit</Divider>
            <Row>
                <Col span={24}>
                    <StatusForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    formErrors: state.tasks.formErrors,
    status: state.tasks.status,
})

const StatusEditComponent = Form.create({ name: 'status_edit_form',  })(StatusEditContainer)

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {updateStatus, getStatusDetail})
)(StatusEditComponent)
