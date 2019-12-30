import React, {useState} from 'react'
import {
    Alert,
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

const { Option } = Select;

const DomainForm = (props) => {
    const {
        onSubmit, getFieldDecorator, createFormErrors, managers, statuses,
        alexa_statuses, currentUser, companies
    } = props;

    const [companyAddress, setCompanyAddress] = useState('--');
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
                    <Form.Item label="Domain name" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input domain name!' }],
                        })( <Input  placeholder="example.com" /> )}
                    </Form.Item>
                    <Form.Item label="Manager" {...formItemLayout}>
                        {getFieldDecorator('manager', {initialValue: currentUser.pk})(
                            <Select>
                                {managers && managers.map((manager, index) => <Option key={index} value={manager.pk}>{manager.username}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Status" {...formItemLayout}>
                        {getFieldDecorator('status', {initialValue: 'ACTIVE'})(
                            <Select>
                                {statuses && statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label="Company" {...formItemLayout}>
                        {getFieldDecorator('company', {initialValue: ''})(
                            <Select onChange={onChangeAddress}>
                                {companies && companies.map((company, index) => <Option key={index} value={company.pk}>{company.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Company Address" {...formItemLayout}>
                        <span>{companyAddress}</span>
                    </Form.Item>
                    <Form.Item label="Check" {...formItemLayout}>
                        {getFieldDecorator('use_custom_address', {
                            valuePropName: 'checked',
                            initialValue: false,
                            onChange: (e) => setCustomAddress(!e.target.checked)
                        })(<Checkbox>Use custom address instead Company address</Checkbox>)}
                    </Form.Item>
                    <Form.Item label="Custom address" {...formItemLayout}>
                        {getFieldDecorator('custom_address', {
                            initialValue: '',
                        })( <Input disabled={customAddress} placeholder="custom address" /> )}
                    </Form.Item>

                </Col>
                <Col span={7}>
                    <Form.Item label="Alexa status" {...formItemLayout}>
                        {getFieldDecorator('alexa_status', {
                            initialValue: 'OFF'
                        })(
                            <Select>
                                {alexa_statuses && alexa_statuses.map((status, index) => <Option key={index} value={status.value}>{status.text}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Alexa Comment" {...formItemLayout}>
                        {getFieldDecorator('alexa_comment', {initialValue: ''})( <Input  placeholder="Comment ..." /> )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Item>
                        {createFormErrors ? createFormErrors.map(msg => <Alert message={msg} type="error" />) : '' }
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Form.Item>
                    <Col offset={11} span={2}>
                        <Button type="primary" htmlType="submit" className={css.submitButton}>
                            Create
                        </Button>
                    </Col>
                </Form.Item>
            </Row>
        </Form>
    )
};

export default DomainForm;
