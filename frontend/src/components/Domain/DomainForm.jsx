import React, {useState} from 'react'
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select
} from 'antd';
import "antd/dist/antd.css";
import css from "../Login/Login.module.css";
import Checkbox from "antd/es/checkbox";
import {createDynamic} from "../Common/DynamicForm/DynamicFieldSet";

const { Option } = Select;

const EmailDynamic = (props) => {
    const _props = {
        ...props,
        field_name: 'email',
        placeholder: 'email@gmail.com',
        limitCount: 3,
        required: false,
    };

    return createDynamic(_props)
};


const DomainForm = (props) => {
    const {
        onSubmit, getFieldDecorator, formErrors, managers, statuses,
        alexa_statuses, initManagerValuePk, companies, getFieldValue,
        setFieldsValue,
    } = props;

    const getInitialValue = (propName, defaultValue='') => {
        let value;
        propName.split('.').forEach(e => value = value ? value[e] : props[e]);
        return value || defaultValue
    };

    const [companyAddress, setCompanyAddress] = useState(getInitialValue('company.address'));
    const [customAddress, setCustomAddress] = useState(true);

    const onChangeAddress = (value) => {
        const company = companies.filter(v => v.pk === value)[0];
        setCompanyAddress(company.address)
    };

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={7}>
                    <Form.Item
                        {...formErrors.name && {
                            help: formErrors.name,
                            validateStatus: 'error',
                        }}
                        label="Domain name" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: getInitialValue('name'),
                            rules: [{ required: true, message: 'Please input domain name!' }],
                        })( <Input disabled={!!getInitialValue('name')} placeholder="example.com" /> )}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.manager && {
                            help: formErrors.manager,
                            validateStatus: 'error',
                        }}
                        label="Manager" {...formItemLayout}>
                        {getFieldDecorator('manager', {initialValue: initManagerValuePk})(
                            <Select>
                                {managers && managers.map((manager, index) => <Option key={index} value={manager.pk}>{manager.username}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.status && {
                            help: formErrors.status,
                            validateStatus: 'error',
                        }}
                        label="Status" {...formItemLayout}>
                        {getFieldDecorator('status', {initialValue: getInitialValue('status', 'ACTIVE')})(
                            <Select>
                                {statuses && statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                            </Select>
                        )}
                    </Form.Item>

                    <EmailDynamic getFieldDecorator={getFieldDecorator}
                                  getFieldValue={getFieldValue}
                                  setFieldsValue={setFieldsValue}
                                  formItemLayout={formItemLayout}
                    />

                </Col>
                <Col span={7}>
                    <Form.Item
                        {...formErrors.company && {
                            help: formErrors.company,
                            validateStatus: 'error',
                        }}
                        label="Company" {...formItemLayout}>
                        {getFieldDecorator('company', {initialValue: getInitialValue('company.pk')})(
                            <Select onChange={onChangeAddress}>
                                {companies && companies.map((company, index) => <Option key={index} value={company.pk}>{company.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Company Address" {...formItemLayout}>
                        <span>{companyAddress}</span>
                    </Form.Item>
                    <Form.Item
                        {...formErrors.use_custom_address && {
                            help: formErrors.use_custom_address,
                            validateStatus: 'error',
                        }}
                        label="Check" {...formItemLayout}>
                        {getFieldDecorator('use_custom_address', {
                            valuePropName: 'checked',
                            initialValue: getInitialValue('use_custom_address', false),
                            onChange: (e) => setCustomAddress(!e.target.checked)
                        })(<Checkbox>Use custom address instead Company address</Checkbox>)}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.custom_company_address && {
                            help: formErrors.custom_company_address,
                            validateStatus: 'error',
                        }}
                        label="Custom address" {...formItemLayout}>
                        {getFieldDecorator('custom_company_address', {
                            initialValue: getInitialValue('custom_company_address'),
                        })( <Input disabled={customAddress} placeholder="custom address" /> )}
                    </Form.Item>

                </Col>
                <Col span={7}>
                    <Form.Item
                        {...formErrors.alexa_status && {
                            help: formErrors.alexa_status,
                            validateStatus: 'error',
                        }}
                        label="Alexa status" {...formItemLayout}>
                        {getFieldDecorator('alexa_status', {
                            initialValue: getInitialValue('alexa_status', 'OFF')
                        })(
                            <Select>
                                {alexa_statuses && alexa_statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.alexa_comment && {
                            help: formErrors.alexa_comment,
                            validateStatus: 'error',
                        }}
                        label="Alexa Comment" {...formItemLayout}>
                        {getFieldDecorator('alexa_comment', {
                            initialValue: getInitialValue('alexa_comment')
                        })( <Input placeholder="Comment ..." /> )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Form.Item>
                    <Col offset={11} span={2}>
                        <Button type="primary" htmlType="submit" className={css.submitButton}>
                            Save
                        </Button>
                    </Col>
                </Form.Item>
            </Row>
        </Form>
    )
};

export default DomainForm;
