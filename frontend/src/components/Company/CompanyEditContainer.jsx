import React from 'react'
import {Divider, Row, Col, Form} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {useDispatch, useSelector} from "react-redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {CompanyForm} from "./CompanyForm"
import {updateCompany} from "../../redux/company-reducer"
import {
    getCompanyByIdS,
    getCompanyFormErrorsS
} from "../../selectors/company-selector"
import {useParams} from "react-router-dom"


const CompanyEditContainer = (props) => {
    const {getFieldDecorator, validateFields } = props.form

    const dispatch = useDispatch()
    const {companyId} = useParams()

    const company = useSelector( state => getCompanyByIdS(state, parseInt(companyId)))
    const formErrors = useSelector(getCompanyFormErrorsS)

    const onSubmit = (e) => {
        e.preventDefault()
        validateFields((err, values) => {
            if (!err) {
                const data = {
                    pk: companyId,
                    ...values,
                }
                dispatch(updateCompany(companyId, data))
            }
        }
        )
    }
    const cancelLink = '/companies'

    const _props = {
        cancelLink, company, getFieldDecorator, formErrors, onSubmit
    }
    return (
        <div>
            <Divider>Company edit</Divider>
            <Row>
                <Col span={24}>
                    <CompanyForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
}

const CompanyEditComponent = Form.create({ name: 'company_edit_form',  })(CompanyEditContainer)

export default compose(withAuthRedirect)(CompanyEditComponent)
