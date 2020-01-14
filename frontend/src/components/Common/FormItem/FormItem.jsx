import React from 'react'
import {Form} from "antd";


const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const getInitialField = (obj, fields) => {
    let value;
    fields.forEach(field => {
        let f = field.split('_')[0];
        value ? value = value[f] : value = obj[f]
    });
    return value
};

export const createFormItem = (field, formErrors, getFieldDecorator, Component, obj=false, initial='', rules=[]) => {

    //set field initial field
    let fields = field.split('.');
    field = fields[0];

    if (typeof(obj) === 'object' && !initial){
        initial = getInitialField(obj, fields);
    }

    let labelValue = field;
    const doubleField =  field.split('_');
    if (doubleField.length > 1) {
        labelValue = doubleField.join(' ');
    }
    return (
        <Form.Item
            {...formErrors[field] && {
                help: formErrors[field],
                validateStatus: 'error',
            }}
            label={labelValue} {...formItemLayout}>
            {getFieldDecorator(field, {
                initialValue: initial,
                rules: rules,
            })( Component )}
        </Form.Item>
    )
};
