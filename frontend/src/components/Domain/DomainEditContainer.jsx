import React, {useEffect} from 'react'
import {Divider, Form} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {connect, useDispatch, useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {loadCurrentDomain, updateDomain} from "../../redux/domain-reducer"
import {DomainForm} from "./DomainForm"
import {additionalDomainProps} from "../../hoc/additionalDomainProps"
import {submitCreateUpdateForm} from "../../utils/utils"
import {getCurrentDomainS} from "../../selectors/domains-selectors"


// todo: refactor updateDomain, submitCreateUpdateForm
const DomainDetailContainer = (props) => {
    const {
        getFieldDecorator, validateFields, getFieldValue, setFieldsValue
    } = props.form
    const {
        updateDomain, managers, statuses, formErrors,
        alexa_statuses, companies, currentUser, emails, telephones
    } = props

    const dispatch = useDispatch()

    const {domainId} = useParams()

    const currentDomain = useSelector(getCurrentDomainS)

    const loadDomain = () => {
        dispatch(loadCurrentDomain(domainId))
    }

    useEffect(loadDomain, [domainId])

    const onSubmit = (e) => {
        e.preventDefault()
        submitCreateUpdateForm(validateFields, updateDomain, domainId)
    }

    const cancelLink = `domains/${domainId}`

    const _props = {formErrors, managers, statuses, alexa_statuses, cancelLink,
        companies, currentDomain, currentUser, onSubmit, getFieldDecorator,
        setFieldsValue, getFieldValue, emails, telephones
    }
    return (
        <div>
            <Divider>Domain detail</Divider>
            <DomainForm {..._props} />
        </div>
    )
}

const DomainDetailComponent = Form.create({ name: 'domain_edit_form',  })(DomainDetailContainer)


export default compose(
    withAuthRedirect,
    additionalDomainProps,
    connect(null, {updateDomain}),
)(DomainDetailComponent)
