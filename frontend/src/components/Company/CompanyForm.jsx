import React from 'react'
import {
    Button,
    Col,
    Form,
    Input,
    Row,
} from 'antd';
import "antd/dist/antd.css";
import {NavLink} from "react-router-dom";
import {createFormItem} from "../Common/FormItem/FormItem";


const CompanyForm = (props) => {
    const { onSubmit, getFieldDecorator } = props;
    const { formErrors } = props;

    const cancelLink = props.cancelLink ? props.cancelLink : '/';

    // wrapper
    const formItem = (field, Component, initial='', rules=[]) => {
        return createFormItem(field, formErrors, getFieldDecorator, Component, props.company, initial, rules)
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={5}>
                    {formItem('name',
                        <Input placeholder="company name"/>,
                        '',
                        [{ required: true, message: 'Please input company name!' }],
                    )}
                </Col>
                <Col span={12}>
                    {formItem('address',
                        <Input placeholder="company address"/>,
                        '',
                        [{ required: true, message: 'Please input company name!' }],
                    )}
                </Col>
            </Row>

            <Row>
                <Form.Item>
                    <Col offset={8} span={1}>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Col>
                    <Col span={1}>
                        <NavLink to={cancelLink}>
                            <Button type="danger">
                                Cancel
                            </Button>
                        </NavLink>
                    </Col>
                </Form.Item>
            </Row>
        </Form>
    )
};

export default CompanyForm;
