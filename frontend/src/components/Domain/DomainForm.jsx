import React from 'react'
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

const DomainForm = ({onSubmit, getFieldDecorator, createFormErrors}) => {
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={7}>
                    <Form.Item label="Domain name" {...formItemLayout}>
                        {getFieldDecorator('domain', {
                            rules: [{ required: true, message: 'Please input domain name!' }],
                        })( <Input  placeholder="example.com" /> )}
                    </Form.Item>
                    <Form.Item label="Manager" {...formItemLayout}>
                        {getFieldDecorator('manager', {initialValue: '1'})(
                            <Select>
                                <Option value="1">manager 1</Option>
                                <Option value="2">manager 2</Option>
                                <Option value="3">manager 3</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Status" {...formItemLayout}>
                        {getFieldDecorator('status', {initialValue: '1'})(
                            <Select>
                                <Option value="1">status 1</Option>
                                <Option value="2">status 2</Option>
                                <Option value="3">status 3</Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label="Company" {...formItemLayout}>
                        {getFieldDecorator('company', {initialValue: '1'})(
                            <Select>
                                <Option value="1">company 1</Option>
                                <Option value="2">company 2</Option>
                                <Option value="3">company 3</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Check" {...formItemLayout}>
                        <Checkbox onChange={alert}>Use custom address instead Company</Checkbox>
                    </Form.Item>
                    <Form.Item label="Domain name" {...formItemLayout}>
                        {getFieldDecorator('custom_address', {})( <Input  placeholder="custom address" /> )}
                    </Form.Item>

                </Col>
                <Col span={7}>
                    <Form.Item label="Alexa status" {...formItemLayout}>
                        {getFieldDecorator('manager', {
                            initialValue: 'lucy'
                        })(
                            <Select>
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="betty">betty</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Alexa Comment" {...formItemLayout}>
                        {getFieldDecorator('alexa_comment', {})( <Input  placeholder="custom address" /> )}
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
