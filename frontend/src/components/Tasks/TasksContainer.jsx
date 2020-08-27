import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {connect} from "react-redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {NavLink, withRouter} from "react-router-dom"
import {getStatusList, getTaskList} from "../../redux/task-reducer"
import {
    getStatusListS,
    getTaskListS,
    getTasksListPageTotalS
} from "../../redux/task-selector"
import style from "./Tasks.module.css"
import {getAbsoluteUrlOr404S} from "../../redux/company-selector"
import {getIsLoadingS} from "../../selectors/app-selector"


const TasksContainer = (props) => {

    const {getTaskList, getStatusList} = props
    const {tasks, total, isLoading, statuses} = props

    useEffect(() => {
        getTaskList()
        getStatusList()
    },[getTaskList, getStatusList])

    const onApplyFilter = (pagination, filters, sorter, extra) => {
        getTaskList(pagination.current, filters)
    }

    const [config, setConfig] = useState({})
    useEffect(() => {
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field})
        const setRowColor = (row) => (row.status ? style['rowColor'+row.status.status] : '')

        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 10,
                position: total >= 10 ? 'bottom' : 'none'
            },
            loading: isLoading,
            rowClassName: row => setRowColor(row),
            columns: [
                {
                    ...getColumn('Title', 'title'),
                    render: (title, row) => <NavLink to={getAbsoluteUrlOr404S(row.url)} >{title}</NavLink>
                },
                {...getColumn('Domain', 'domain.name')},
                {
                    ...getColumn('Status', 'status.status'),
                    filters: statuses
                },
                {...getColumn('Code', 'code.code')},
                {
                    ...getColumn('Executors', 'executors'),
                    render: executors=> executors
                        ? executors.map((item, index) => <span key={index}>{item.username}&nbsp</span>)
                        : null
                },
            ],
            dataSource: isLoading ? [] : tasks,
            rowKey: row => row.pk,
        })
    }, [isLoading, tasks, total, statuses])
    return (
        <div>
            <Divider>Tasks here</Divider>
            <Row>
                <Col span={24} style={{padding: '0 15px'}}>
                    <Table {...config} onChange={onApplyFilter}/>
                </Col>
            </Row>
        </div>
    )
}


const mapStateToProps = (state) => ({
    tasks: getTaskListS(state),
    total: getTasksListPageTotalS(state),
    isLoading: getIsLoadingS(state),
    statuses: getStatusListS(state),
})

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getTaskList, getStatusList})
)(TasksContainer)
