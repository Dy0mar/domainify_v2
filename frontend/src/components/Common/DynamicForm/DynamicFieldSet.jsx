import React from 'react';
import 'antd/dist/antd.css';
import {Button, Form, Icon, Input, message} from 'antd';

let id = 0;

export const createDynamic = (props) => {

    const {
        formItemLayout, getFieldDecorator, getFieldValue, setFieldsValue,
        limitCount, existsField
    } = props;

    const remove = k => {
        // can use data-binding to get
        const keys = getFieldValue('keys');

        // can use data-binding to set
        setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    const add = () => {
        const keys = getFieldValue('keys');

        if (limitCount && keys.length === limitCount) {
            message.error('only available  ' + limitCount + ' fields');
            return;
        }
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        setFieldsValue({
            keys: nextKeys,
        });
    };

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 20, offset: 4 },
            sm: { span: 12, offset: 12 },
        },
    };

    getFieldDecorator('keys', { initialValue: existsField ? existsField.map(item => (item)) : [] });

    if (existsField) {
        existsField.forEach((item, index) => {
            const name = `${props.field_name}_${index}`;
            getFieldDecorator(name, {initialValue: item })
        })
    }

    const keys = getFieldValue('keys');
    const formItems = keys.map((item, index) => (

        <Form.Item
            {...(formItemLayout)}
            label={`${props.field_name} ${index+1}`}
            required={props.required}
            key={item}
        >
            {getFieldDecorator(`${props.field_name}_${index}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: props.rules || [],
            })(<Input placeholder={props.placeholder} style={{ width: '90%', marginRight: 8 }} />)}
            {keys.length > 0 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => remove(item)}
                />
            ) : null}
        </Form.Item>
    ));
    return (
        <>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={add} style={{ /*width: '60%'*/ }}>
                    <Icon type="plus" /> Add field {props.field_name}
                </Button>
            </Form.Item>
        </>
    );

};

