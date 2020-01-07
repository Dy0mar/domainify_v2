import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Popover, Button} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {getDomainList} from "../../redux/domain-reducer";
import {
    getDomainIsLoadingS,
    getDomainListPageTotalS,
    getDomainListS, getUrlOr404S
} from "../../redux/domains-selectors";
import style from "./Domains.module.css";
import {getManagerListS} from "../../redux/users-selectors";


const DomainsContainer = (props) => {
    const {domains, managers, total, isLoading} = props;
    const {getDomainList } = props;

    // load
    useEffect(() => {
        getDomainList();
    }, [getDomainList]);


    const onApplyFilter = (pagination, filters, sorter, extra) => {
        getDomainList(pagination.current, filters)
    };

    const [config, setConfig] = useState({});
    useEffect(() => {
        setConfig({
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
                            ? manager.username
                            : '--'
                    )
                },
                {
                    title: 'Company',
                    dataIndex: 'company.name',
                    key: 'company.name',
                    render: (name, row) => (row.company
                            ? <NavLink to={getUrlOr404S(row.company.url)} >{name}</NavLink>
                            : '--'
                    )
                },
                {
                    title: 'Address',
                    dataIndex: 'company.custom_company_address',
                    key: 'company.custom_company_address',
                    render: (address, row) => (row.use_custom_address
                            ? <Popover content={row.company.address} title="Custom address"><Button type={'link'}>{row.custom_company_address.substr(0,10)}...</Button></Popover>
                            : row.company
                                ? <Popover content={row.company.address} title="Company address"><Button type={'link'}>{row.company.address.substr(0,10)}...</Button></Popover>
                                : '--'
                    )
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
    }, [isLoading, domains, total, managers]);

    return (
        <div>
            <Divider>Domains here / <NavLink to={'domains/create/'} >Add domain</NavLink> </Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} onChange={onApplyFilter}/>
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    domains: getDomainListS(state),
    total: getDomainListPageTotalS(state),
    isLoading: getDomainIsLoadingS(state),
    managers: getManagerListS(state),
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getDomainList})
)(DomainsContainer);
