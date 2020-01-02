import React from 'react';
import 'antd/dist/antd.css';
import {Button, Form, Icon, Input, message} from 'antd';

let id = 0;

export const createDynamic = (props) => {

    const {
        formItemLayout, getFieldDecorator, getFieldValue, setFieldsValue,
        limitCount
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
        // can modify noMoreThan
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

    getFieldDecorator('keys', { initialValue: [] });

    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (

        <Form.Item
            {...(formItemLayout)}
            label={`${props.field_name} ${index+1}`}
            required={props.required}
            key={k}
        >

            {getFieldDecorator(`${props.field_name}[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                    {
                        message: "Please input passenger's name or delete this field.",
                    },
                ],
            })(<Input placeholder={props.placeholder} style={{ width: '90%', marginRight: 8 }} />)}
            {keys.length > 0 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => remove(k)}
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

