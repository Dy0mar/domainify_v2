import React from 'react'
import {Button, Col, Form, Input, Row} from 'antd';
import "antd/dist/antd.css";

import {NavLink} from "react-router-dom";

const StatusForm = (props) => {
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
                <Col span={5}>
                    <Form.Item
                        {...formErrors.name && {
                            help: formErrors.name,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('status', {
                            rules: [{ required: true, message: 'Please input status!' }],
                            initialValue: getInitialValue('status.status'),
                        })(
                            <Input placeholder="STATUS"/>,
                        )}
                    </Form.Item>
                </Col>
                <Col span={1}>&nbsp;</Col>
                <Col span={5}>
                    <Form.Item
                        {...formErrors.address && {
                            help: formErrors.address,
                            validateStatus: 'error',
                        }}>
                        {getFieldDecorator('comment', {
                            initialValue: getInitialValue('status.comment'),
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

export default StatusForm
