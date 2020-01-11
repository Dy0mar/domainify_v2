import React from 'react'
import {Form} from "antd";


const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const getInitialField = (obj, fields) => {
    let value;
    fields.forEach(field => value ? value = value[field] : value = obj[field]);
    return value
};

export const createFormItem = (field, formErrors, getFieldDecorator, Component, obj=false, initial='', rules=[]) => {

    //set field initial field
    let fields = field.split('.');
    field = fields[0];

    if (typeof(obj) === 'object' && !initial){
        initial = getInitialField(obj, fields);
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

