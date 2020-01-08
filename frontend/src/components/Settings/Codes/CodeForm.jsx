import React from 'react'
import {Button, Col, Form, Input, Row} from 'antd';
import "antd/dist/antd.css";

import {NavLink} from "react-router-dom";

const CodeForm = (props) => {
    const {getFieldDecorator, onSubmit} = props;
    const {formErrors} = props;

    const cancelLink = '/settings';

    const getInitialValue = (propName, defaultValue='') => {
        let value;
        propName.split('.').forEach(e => value = value ? value[e] : props[e]);
        return value || defaultValue
    };
    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={6}>
                    <Form.Item
                        {...formErrors.name && {
                            help: formErrors.name,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input name!' }],
                            initialValue: getInitialValue('code.name'),
                        })(
                            <Input placeholder="name"/>,
                        )}
                    </Form.Item>
                </Col>
                <Col span={1}>&nbsp;</Col>
                <Col span={6}>
                    <Form.Item
                        {...formErrors.code && {
                            help: formErrors.code,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('code', {
                            initialValue: getInitialValue('code.code'),
                        })(
                            <Input placeholder="SOME_CODE"/>,
                        )}
                    </Form.Item>
                </Col>
                <Col span={1}>&nbsp;</Col>
                <Col span={10}>
                    <Form.Item
                        {...formErrors.comment && {
                            help: formErrors.comment,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('comment', {
                            initialValue: getInitialValue('code.comment'),
                        })(
                            <Input placeholder="comment..."/>,
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

export default CodeForm
