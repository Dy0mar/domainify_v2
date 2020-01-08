import React, {useEffect} from 'react'
import {Divider, Row, Col, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {withRouter} from "react-router-dom";
import TaskForm from "./TaskForm";
import {submitCreateUpdateForm} from "../../utils/utils";
import {getTaskDetail} from "../../redux/task-reducer";


const TaskContainer = (props) => {
    const {taskId} = props.match.params;
    const {getFieldDecorator, validateFields} = props.form;
    const {formErrors, task, getTaskDetail, updateTask} = props;

    useEffect(() => {
        if (taskId)
            getTaskDetail(taskId)
    },[getTaskDetail, taskId]);

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, updateTask, task.pk);
    };

    const _props = {formErrors, getFieldDecorator};

    return (
        <div>
            <Divider>Task here</Divider>
            <Row>
                <Col span={24} style={{padding: '0 15px'}}>
                    <TaskForm {..._props}/>
                    {task.title}
                </Col>
            </Row>
        </div>
    )
};

const TaskComponent = Form.create({ name: 'task_form',  })(TaskContainer);

const mapStateToProps = (state) => ({
    task: state.tasks.task,
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getTaskDetail})
)(TaskComponent);
