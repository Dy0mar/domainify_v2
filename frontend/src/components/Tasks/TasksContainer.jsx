import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {NavLink, withRouter} from "react-router-dom";
import {getTaskList} from "../../redux/task-reducer";
import {getTaskListS, getTasksListPageTotalS} from "../../redux/task-selector";
import style from "../Domains/Domains.module.css";
import {getIsLoadingS} from "../../redux/app-selector";
import {getAbsoluteUrlOr404S} from "../../redux/company-selector";


const TasksContainer = (props) => {

    const {getTaskList} = props;
    const {tasks, total, isLoading} = props;

    useEffect(() => {
        getTaskList()
    },[getTaskList]);


    const [config, setConfig] = useState({});
    useEffect(() => {
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field});

        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 10,
                position: total >= 10 ? 'bottom' : 'none'
            },
            loading: false,
            rowClassName: record => style['highlight'+record.status],
            columns: [
                {
                    ...getColumn('Title', 'title'),
                    render: (title, row) => <NavLink to={getAbsoluteUrlOr404S(row.url)} >{title}</NavLink>
                },
                {...getColumn('Domain', 'domain.name')},
                {
                    ...getColumn('Status', 'status.status'),
                    // filters:
                },
                {...getColumn('Code', 'code.code')},
                {
                    ...getColumn('Executors', 'executors'),
                    render: executors=> executors
                        ? executors.map((item, index) => <span key={index}>{item.username}&nbsp;</span>)
                        : null
                },
            ],
            dataSource: isLoading ? [] : tasks,
            rowKey: row => row.pk,
        })
    }, [isLoading, tasks, total]);
    return (
        <div>
            <Divider>Tasks here</Divider>
            <Row>
                <Col span={24} style={{padding: '0 15px'}}>
                    <Table {...config} />
                </Col>
            </Row>
        </div>
    )
};


const mapStateToProps = (state) => ({
    tasks: getTaskListS(state),
    total: getTasksListPageTotalS(state),
    isLoading: getIsLoadingS(state),
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getTaskList})
)(TasksContainer);
