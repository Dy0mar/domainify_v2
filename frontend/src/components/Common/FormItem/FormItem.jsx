import React from 'react'
import {Form} from "antd";


const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const getInitialField = (obj, fields) => {
    let value;
    fields.forEach(field => {
        value ? value = value[field] : value = obj[field]
    });
    return value
};

export const createFormItem = (
    field, label, formErrors, getFieldDecorator, Component, obj=false, initial='', rules=[], onChange=false
) => {

    //set field initial field
    let fields = field.split('.');
    field = fields[0];

    if (typeof(obj) === 'object' && !initial){
        initial = getInitialField(obj, fields);
    }

    // hidden field
    const style = {};
    if (label === 'hide_field')
        style['display'] = 'none';

    // checkbox field
    const params = {};
    const checkBoxes = ['notify', 'use_custom_address'];
    if (checkBoxes.indexOf(field) !== -1 )
        params['valuePropName'] = 'checked';

    if (onChange !== false)
        params['onChange'] = onChange;

    return (
        <Form.Item style={{...style}}
            {...formErrors[field] && {
                help: formErrors[field],
                validateStatus: 'error',
            }}
            label={label} {...formItemLayout}>
            {getFieldDecorator(field, {
                ...params,
                initialValue: initial,
                rules: rules,
            })( Component )}
        </Form.Item>
    )
};
