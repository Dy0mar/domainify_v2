import React, {useEffect, useState} from 'react'
import {Divider, Row, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {Redirect, withRouter} from "react-router-dom";
import {submitCreateUpdateForm} from "../../utils/utils";
import {
    createTask,
    getCodeList,
    getStatusList,
    getTaskDetail, updateTask
} from "../../redux/task-reducer";
import {TaskItemsType} from "./TaskComponents";
import {getCodeListS, getStatusListS} from "../../redux/task-selector";
import TaskForm from "./TaskForm";
import {
    getDomainDataSourceS,
    getDomainListS
} from "../../redux/domains-selectors";
import {getUserFullList} from "../../redux/user-reducer";
import {getUserListS} from "../../redux/users-selectors";
import {autocompleteDomainList} from "../../redux/domain-reducer";
import {getIsLoadingS} from "../../redux/app-selector";


const TaskContainer = (props) => {
    const taskId = props.match.params.taskId || 0;
    const {getFieldDecorator, validateFields} = props.form;

    const {
        codes, domains, statuses, users,
        formErrors, task, dataSource, isLoading
    } = props;
    const {
        getTaskDetail, updateTask, createTask,
        getCodeList, getStatusList, getUserFullList, autocompleteDomainList
    } = props;

    const [domainId, setDomainID] = useState(null);
    const [taskType, setTaskType] = useState(taskId);

    useEffect(() => {
        setTaskType(taskId)
    },[taskId]);

    // get Code list for set taskType
    useEffect(() => {
        getCodeList();
        getStatusList();
        getUserFullList();
    },[getCodeList, getStatusList, getUserFullList]);

    useEffect(() => {
        if (taskId){
            getTaskDetail(taskId)
        }
    },[getTaskDetail, taskId]);

    const onSubmit = (e) => {
        e.preventDefault();
        let thunk = createTask;
        if (taskId)
            thunk = updateTask;
        submitCreateUpdateForm(validateFields, thunk, taskId);
    };


    const cancelLink = () => {
        if (taskId) return <Redirect to={'/tasks'} />;
        else setTaskType(0)
    };

    const onSearch = (value) => {
        if (value.length > 2) autocompleteDomainList(value);
    };
    const onSelect = (value) => {
        let obj = dataSource.filter(item => item[1] === value)[0];
        setDomainID(obj[0])
    };

    const _props = {
        codes, domains, statuses, users, formErrors, taskType,
        getFieldDecorator, cancelLink, onSearch, onSubmit,
        onSelect,
    };

    return (
        <div>
            <Divider>Task here</Divider>
            {taskType===0 && codes && <TaskItemsType codes={codes} handleClick={setTaskType} />}

            {taskType!==0 && isLoading===false && <Row>
                <TaskForm {..._props}
                          dataSource={dataSource.map(item=>item[1])}
                          domain={domainId}
                          task={taskId ? task : false}
                />
            </Row>}
        </div>
    )
};

const TaskComponent = Form.create({ name: 'task_form',  })(TaskContainer);

const mapStateToProps = (state) => ({
    task: state.tasks.task,
    codes: getCodeListS(state),
    statuses: getStatusListS(state),
    domains: getDomainListS(state),
    users: getUserListS(state),
    dataSource: getDomainDataSourceS(state),
    formErrors: state.tasks.formErrors,
    isLoading: getIsLoadingS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {
        createTask, updateTask,
        getTaskDetail, getCodeList, getStatusList, getUserFullList, autocompleteDomainList
    })
)(TaskComponent);
