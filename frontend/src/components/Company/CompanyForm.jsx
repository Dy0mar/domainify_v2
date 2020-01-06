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


const CompanyForm = (props) => {
    const { onSubmit, getFieldDecorator } = props;
    const { company, formErrors } = props;

    const cancelLink = props.cancelLink ? props.cancelLink : '/';

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={8}>

                    <Form.Item
                        {...formErrors.name && {
                            help: formErrors.name,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input company name!' }],
                            initialValue: company.name
                        })(
                            <Input placeholder="company name"/>,
                        )}
                    </Form.Item>
                </Col>
                <Col span={1}>&nbsp;</Col>
                <Col span={15}>
                    <Form.Item
                        {...formErrors.address && {
                            help: formErrors.address,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('address', {
                            initialValue: company.address
                        })(
                            <Input placeholder="company address"/>,
                        )}
                    </Form.Item>
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
