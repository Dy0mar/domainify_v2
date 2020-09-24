import React, {useEffect} from 'react'
import {Divider, Form} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {connect} from "react-redux"
import {useParams} from "react-router-dom"
import {loadCurrentDomain, updateDomain} from "../../redux/domain-reducer"
import DomainForm from "./DomainForm"
import {additionalDomainProps} from "../../hoc/additionalDomainProps"
import {submitCreateUpdateForm} from "../../utils/utils"


const DomainDetailContainer = (props) => {
    const {
        getFieldDecorator, validateFields, getFieldValue, setFieldsValue
    } = props.form
    const {
        currentDomain, loadCurrentDomain, managers, statuses, formErrors,
        alexa_statuses, companies, currentUser, emails, telephones
    } = props

    const {domainId} = useParams()

    useEffect(() => {
        loadCurrentDomain(domainId)
    }, [loadCurrentDomain, domainId])

    const onSubmit = (e) => {
        e.preventDefault()
        submitCreateUpdateForm(validateFields, props.updateDomain, domainId)
    }

    const cancelLink = '/domains/'+domainId

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

const mapStateToProps = (state) => ({
    currentDomain: state.domains.currentDomain
})

export default compose(
    withAuthRedirect,
    additionalDomainProps,
    connect(mapStateToProps, {loadCurrentDomain, updateDomain}),
)(DomainDetailComponent)
