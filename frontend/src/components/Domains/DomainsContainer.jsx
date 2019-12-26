import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {getDomainList} from "../../redux/domain-reducer";
import {
    getDomainIsLoadingS,
    getDomainListPageTotalS,
    getDomainListS, getManagersListS, getUrlOr404S
} from "../../redux/domains-selectors";
import style from "./Domains.module.css";


const DomainsContainer = (props) => {
    const {domains, managers, total, getDomainList, isLoading} = props;

    const [page] = useState(1);
    useEffect(() => {
        getDomainList(page)
    }, [page, getDomainList]);

    // function onApplyFilter(pagination, filters, sorter, extra) {
    //     getDomainList(pagination.current, filters)
    // }

    const onApplyFilter = (pagination, filters, sorter, extra) => {
        console.log(pagination, filters, sorter, extra)
        getDomainList(pagination.current, filters)
    }

    const [config, setConfig] = useState({});
    useEffect(() => {
        setConfig({
            onChange: onApplyFilter,
            bordered: true,
            pagination : {
                total: total,
                pageSize: 10,
                position: total >= 10 ? 'bottom' : 'none'
            },
            loading: isLoading,
            rowClassName: record => style['highlight'+record.status],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, row) => <NavLink to={getUrlOr404S(row.url)} >{text}</NavLink>

                },
                {
                    title: 'manager',
                    dataIndex: 'manager',
                    key: 'manager',
                    filters: managers,
                    render: manager => (manager
                            ? <NavLink to={getUrlOr404S(manager.url)} >{manager.username}</NavLink>
                            : '--'
                    )
                },
                {
                    title: 'Company name',
                    dataIndex: 'company.name',
                    key: 'company.name',
                    render: (name, row) => (row.company
                            ? <NavLink to={getUrlOr404S(row.company.url)} >{name}</NavLink>
                            : '--'
                    )
                },
                {
                    title: 'Company address',
                    dataIndex: 'company.address',
                    key: 'company.address',
                },
                {
                    title: 'Alexa status',
                    dataIndex: 'alexa_status',
                    key: 'alexa_status',
                },
                {
                    title: 'Alexa comment',
                    dataIndex: 'alexa_comment',
                    key: 'alexa_comment',
                },
                {
                    title: 'Redirect',
                    dataIndex: 'redirect',
                    key: 'redirect',
                },
                {
                    title: 'Register date',
                    dataIndex: 'register_date',
                    key: 'register_date',
                },
                {
                    title: 'Expire date',
                    dataIndex: 'expire_date',
                    key: 'expire_date',
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                },
            ],
            dataSource: isLoading ? [] : domains,
            rowKey: row => row.name
        })
    }, [page, isLoading, domains, total, managers]);

    return (
        <div>
            <Divider>Domains here</Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} />
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    domains: getDomainListS(state),
    total: getDomainListPageTotalS(state),
    isLoading: getDomainIsLoadingS(state),
    managers: getManagersListS(state),
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getDomainList})
)(DomainsContainer);
