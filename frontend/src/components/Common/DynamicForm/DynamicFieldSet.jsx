import React from 'react';
import 'antd/dist/antd.css';
import {Button, Form, Icon, Input, message} from 'antd';

let id = 0;

export const createDynamic = (props) => {
    // existsField like object
    // {pk: 'value', fieldName: 'value' }

    const {
        getFieldDecorator, getFieldValue, setFieldsValue,
        limitCount, existsField
    } = props;
    const fieldName = props.name ? props.name : 'keys';

    const remove = k => {
        // can use data-binding to get
        const keys = getFieldValue(fieldName);

        // can use data-binding to set
        setFieldsValue({
            [fieldName]: keys.filter(key => key !== k),
        });
    };

    const add = (e) => {
        const keys = getFieldValue(fieldName);

        if (limitCount && keys.length === limitCount) {
            message.error('only available  ' + limitCount + ' fields');
            return;
        }
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        setFieldsValue({
            [fieldName]: nextKeys,
        });
    };
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 20, offset: 4 },
            sm: { span: 12, offset: 12 },
        },
    };

    getFieldDecorator(fieldName, { initialValue: existsField ? existsField.map(item => (item)) : [] });

    if (existsField) {
        existsField.forEach(item => {
            const name = `${props.field_name}_${item.pk}`;
            getFieldDecorator(name, {initialValue: item[props.field_name] })
        })
    }

    const keys = getFieldValue(fieldName);
    const formItems = keys.map((item, index) => (

        <Form.Item
            {...(formItemLayout)}
            label={`${props.field_name} ${index+1}`}
            required={props.required}
            key={item.pk+'_'+index}
        >
            {getFieldDecorator(`${props.field_name}_${item.pk ? item.pk : index}`, {
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

