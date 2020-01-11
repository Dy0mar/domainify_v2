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
        codes, statuses, users, formErrors, dataSource, task,
    } = props;

    const statusInitial = () => {
        let status = statuses.filter(item => (item.status === 'NEW'));
        if (status.length)
            return status[0].pk
    };
    const executorsInitial = () => {
        if (task.executors){
            return task.executors.map(item=>(item.executor));
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
                        task ? '' : statusInitial()
                    )}
                    {formItem('code.code',
                        <Select>
                            {codes && codes.map((item, index) => <Option key={index} value={item.pk}>{item.code}</Option>)}
                        </Select>,
                    )}

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
                    {formItem('domain.name',
                        <AutoComplete dataSource={dataSource}
                                      placeholder="example.com"
                                      style={{ width: 200 }}
                                      onSearch={onSearch}
                                      onSelect={onSelect}
                        />
                    )}


                    {formItem('executors',
                            <Checkbox.Group options={users.map(item => ({label: item.username, value: item.pk}))}/>,
                        task ? executorsInitial() : []
                        )}
                </Col>
            </Row>
        </Form>
    )
};



export default TaskForm
