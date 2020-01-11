import React from 'react'
import {Form} from "antd";


const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


export const createFormItem = (field, formErrors, getFieldDecorator, Component, initial='', rules=[]) => {
    // if initial is object
    if (typeof(initial) === 'object'){
        initial = initial[field];
    }

    return (
        <Form.Item
            {...formErrors[field] && {
                help: formErrors[field],
                validateStatus: 'error',
            }}
            label={field} {...formItemLayout}>
            {getFieldDecorator(field, {
                initialValue: initial,
                rules: rules,
            })( Component )}
        </Form.Item>
    )
};

