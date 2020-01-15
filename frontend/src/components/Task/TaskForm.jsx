import React from 'react'
import "antd/dist/antd.css";
import {
    Button, Col, Form, Input, Row, Select, Checkbox, AutoComplete
} from "antd";
import css from "../Login/Login.module.css";
import {createFormItem} from "../Common/FormItem/FormItem";

const { Option } = Select;
const { TextArea } = Input;

const TaskForm = (props) => {

    const { onSubmit, getFieldDecorator, cancelLink, onSearch, onSelect } = props;

    const {
        codes, statuses, users, formErrors, dataSource, task, domainId,
        taskType, companyInfo,
    } = props;

    const statusInitial = () => {
        if (task && task.status) return task.status.pk;

        let status = statuses.filter(item => (item.status === 'NEW'));
        if (status.length)
            return status[0].pk
    };
    const codeInitial = () => {
        if (task && task.code) return task.code.pk;
        return taskType
    };

    const executorsInitial = () => {
        if (task.executors){
            return task.executors.map(item => (item.executor));
        }
    };

    // wrapper
    const formItem = (field, Component, initial='', rules=[]) => {
        return createFormItem(field, formErrors, getFieldDecorator, Component, task, initial, rules)
    };

    return (
        <Form onSubmit={onSubmit}>
            <Row>
                <Col span={7}>
                    {formItem('title',
                        <Input placeholder="Some title ..." />,
                        '',
                        [{ required: true, message: 'Please input title!' }],
                    )}
                    {formItem('description', <TextArea rows={4} />)}

                </Col>
                <Col span={7}>
                    {formItem('status.status',
                        <Select>
                            {statuses && statuses.map((item, index) => <Option key={index} value={item.pk}>{item.status}</Option>)}
                        </Select>,
                        statusInitial()
                    )}
                    {formItem('code.code',
                        <Select>
                            {codes && codes.map((item, index) => <Option key={index} value={item.pk}>{item.code}</Option>)}
                        </Select>,
                        codeInitial()
                    )}

                    {formItem('executors',
                        <Checkbox.Group options={users.map(item => ({label: item.username, value: item.pk}))}/>,
                        task ? executorsInitial() : []
                    )}

                    {formItem('notify',
                        <Checkbox >notify executor(s)?</Checkbox>,
                        false
                    )}

                </Col>
                <Col span={9}>
                    {formItem('domain_name.name',
                        <AutoComplete dataSource={dataSource}
                                      placeholder="example.com"
                                      style={{ width: 200 }}
                                      onSearch={onSearch}
                                      onSelect={onSelect}
                        />
                    )}

                    {formItem('domain_pk.pk',
                        <Input />,
                        domainId,
                    )}
                    <Row>
                        <Col offset={3}>
                            <div>Company: {companyInfo.company_name}</div>
                            <div>Use custom address: {companyInfo.use_custom_address ? 'yes' : 'no'}</div>
                            <div>Address: {companyInfo.address}</div>
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row>
                <Col offset={8} span={6}>
                    <Form.Item>
                        <Col span={12}>
                            <Button type="primary" htmlType="submit" className={css.submitButton}>
                                Save
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button type="danger" onClick={() => cancelLink()} className={css.submitButton} style={{marginLeft: 10}}>
                                Cancel
                            </Button>
                        </Col>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
};



export default TaskForm
