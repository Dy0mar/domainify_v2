import React from 'react'
import "antd/dist/antd.css";
import {
    Button, Col, Form, Input, Row, Select, Checkbox, AutoComplete
} from "antd";
import css from "../Login/Login.module.css";

const { Option } = Select;
const { TextArea } = Input;

const TaskForm = (props) => {

    const { onSubmit, getFieldDecorator, cancelLink, onSearch, onSelect } = props;

    const {
        codes, statuses, users, formErrors, taskType, dataSource,
    } = props;

    const getInitialValue = (propName, defaultValue='') => {
        let value;
        propName.split('.').forEach(e => value = value ? value[e] : props[e]);
        return value || defaultValue
    };

    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const getStatusInitial = () => {
        let status = statuses.filter(item => (item.status === 'NEW'));
        if (status.length)
            return status[0].pk
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={7}>
                    <Form.Item
                        {...formErrors.title && {
                            help: formErrors.title,
                            validateStatus: 'error',
                        }}
                        label="Title" {...formItemLayout}>
                        {getFieldDecorator('title', {
                            initialValue: getInitialValue('name'),
                            rules: [{ required: true, message: 'Please input title!' }],
                        })( <Input disabled={!!getInitialValue('title', '')} placeholder="My task" /> )}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.description && {
                            help: formErrors.description,
                            validateStatus: 'error',
                        }}
                        label="Description" {...formItemLayout}>
                        {getFieldDecorator('description', {initialValue: getInitialValue('description')})(
                            <TextArea rows={4} />
                        )}
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item
                        {...formErrors.status && {
                            help: formErrors.status,
                            validateStatus: 'error',
                        }}
                        label="Status" {...formItemLayout}>
                        {getFieldDecorator('status', {
                            initialValue: getInitialValue(
                                'statuses.pk',
                                getStatusInitial()
                            )
                        }
                            )( <Select>
                                {statuses && statuses.map((item, index) => <Option key={index} value={item.pk}>{item.status}</Option>)}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        {...formErrors.code && {
                            help: formErrors.code,
                            validateStatus: 'error',
                        }}
                        label="Code" {...formItemLayout}>
                        {getFieldDecorator('code', {initialValue: getInitialValue('codes.pk', taskType)})(
                            <Select>
                                {codes && codes.map((item, index) => <Option key={index} value={item.pk}>{item.code}</Option>)}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Col offset={6} span={6}>
                            <Button type="primary" htmlType="submit" className={css.submitButton}>
                                Save
                            </Button>
                        </Col>
                        <Col span={6}>
                            <Button type="danger" onClick={() => cancelLink()} className={css.submitButton} style={{marginLeft: 10}}>
                                Cancel
                            </Button>
                        </Col>
                    </Form.Item>
                </Col>
                <Col span={9}>
                    <Form.Item
                        {...formErrors.domain && {
                            help: formErrors.domain,
                            validateStatus: 'error',
                        }}
                        label="Domain" {...formItemLayout}>
                        {getFieldDecorator('domain_name', {
                            initialValue: getInitialValue('domain.name')
                        })( <AutoComplete dataSource={dataSource}
                                          placeholder="example.com"
                                          style={{ width: 200 }}
                                          onSearch={onSearch}
                                          onSelect={onSelect}
                        /> )}
                    </Form.Item>
                    <Form.Item
                        {...formErrors.executors && {
                            help: formErrors.executors,
                            validateStatus: 'error',
                        }}
                        label="Executors" {...formItemLayout}>
                        {getFieldDecorator('executors', {})(
                            <Checkbox.Group options={users.map(item => ({label: item.username, value: item.pk}))} /> )}
                    </Form.Item>

                    <Form.Item
                        label="Domain" {...formItemLayout}>
                        {getFieldDecorator('domain', {
                            initialValue: getInitialValue('domain'),
                        })( <Input /> )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
};



export default TaskForm
