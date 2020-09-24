import React, {useEffect, useState} from 'react'
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select
} from 'antd'
import "antd/dist/antd.css"
import css from "../Login/Login.module.css"
import Checkbox from "antd/es/checkbox"
import {createDynamic} from "../Common/DynamicForm/DynamicFieldSet"
import {NavLink} from "react-router-dom"
import {createFormItem} from "../Common/FormItem/FormItem"

const { Option } = Select

const EmailDynamic = (props) => {
    const _props = {
        ...props,
        name: 'emails',
        field_name: 'email',
        placeholder: 'email@gmail.com',
        limitCount: 3,
        required: false,
    }

    return createDynamic(_props)
}

const TelephoneDynamic = (props) => {
    const _props = {
        ...props,
        name: 'telephones',
        field_name: 'telephone',
        placeholder: '+44 (203) 76-91-964',
        limitCount: 3,
        required: false,
    }

    return createDynamic(_props)
}


const DomainForm = (props) => {
    /*
    formErrors, managers, statuses, alexa_statuses, cancelLink,
        companies, currentDomain, currentUser, onSubmit, getFieldDecorator,
        setFieldsValue, getFieldValue
     */
    const { onSubmit, getFieldDecorator, getFieldValue, setFieldsValue } = props

    const cancelLink = props.cancelLink ? props.cancelLink : '/'

    const {
        formErrors, managers, statuses, alexa_statuses,
        companies, currentDomain, currentUser,
    } = props

    const [companyAddress, setCompanyAddress] = useState('')
    useEffect(() => {
        if (currentDomain && currentDomain.company)
            setCompanyAddress(currentDomain.company.address)
    }, [currentDomain])

    const [customAddress, setCustomAddress] = useState(currentDomain ? !currentDomain.use_custom_address : true)

    const onChangeAddress = (value) => {
        const company = companies.filter(v => v.pk === value)[0]
        setCompanyAddress(company.address)
    }

    // wrapper
    const formItem = (field, label, Component, initial='', rules=[], onChange=false) => {
        return createFormItem(field, label, formErrors, getFieldDecorator, Component, currentDomain, initial, rules, onChange)
    }

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={7}>
                    {formItem('name', 'Domain name',
                        <Input disabled={!!currentDomain} placeholder="example.com" />,
                        '',
                        [{ required: true, message: 'Please input company name!' }],
                    )}

                    {formItem('manager.pk', 'Manager',
                        <Select>
                            {managers && managers.map((manager, index) => <Option key={index} value={manager.pk}>{manager.username}</Option>)}
                        </Select>,
                        currentDomain ? '' : currentUser.pk
                    )}

                    {formItem('status', 'Status',
                        <Select>
                                {statuses && statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                        </Select>,
                        currentDomain ? '' : 'ACTIVE'
                    )}

                    <EmailDynamic getFieldDecorator={getFieldDecorator}
                                  getFieldValue={getFieldValue}
                                  setFieldsValue={setFieldsValue}
                                  existsField={currentDomain ? currentDomain.emails : []}
                    />

                    <TelephoneDynamic getFieldDecorator={getFieldDecorator}
                                      getFieldValue={getFieldValue}
                                      setFieldsValue={setFieldsValue}
                                      existsField={currentDomain ? currentDomain.telephones : []}
                    />
                </Col>
                <Col span={7}>
                    {formItem('company.pk', 'Company',
                        <Select onChange={onChangeAddress}>
                            {companies && companies.map((company, index) => <Option key={index} value={company.pk}>{company.name}</Option>)}
                        </Select>,
                    )}

                    <Row className={'ant-form-item'}>
                        <Col offset={2} >
                            <div style={{color:'rgba(0, 0, 0, 0.85)'}}>Company Address: {companyAddress}</div>
                        </Col>
                    </Row>

                    {formItem('use_custom_address', 'Check',
                        <Checkbox>Use custom address instead Company address</Checkbox>,
                        currentDomain ? '': false,
                        [],
                        (e) => setCustomAddress(!e.target.checked)
                    )}

                    {formItem('custom_company_address', 'Custom address',
                        <Input disabled={customAddress} placeholder="custom address" />,
                    )}

                    <Form.Item>
                        <Col offset={6} span={6}>
                            <Button type="primary" htmlType="submit" className={css.submitButton}>
                                Save
                            </Button>
                        </Col>
                        <Col span={6}>
                            <NavLink to={cancelLink}>
                                <Button type="danger" className={css.submitButton} style={{marginLeft: 10}}>
                                    Cancel
                                </Button>
                            </NavLink>
                        </Col>
                    </Form.Item>
                </Col>
                <Col span={9}>
                    {formItem('alexa_status', 'Alexa status',
                        <Select>
                            {alexa_statuses && alexa_statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                        </Select>,
                        currentDomain ? '' : 'OFF'
                    )}

                    {formItem('alexa_comment', 'Alexa Comment',
                        <Input placeholder="custom address" />,
                    )}

                    {formItem('redirect', 'Redirect email',
                        <Input placeholder="email@example.com" />,
                    )}

                </Col>
            </Row>
        </Form>
    )
}

export default DomainForm
