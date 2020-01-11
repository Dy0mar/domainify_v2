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
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field});

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
                    ...getColumn('Name', 'name'),
                    render: (text, row) => <NavLink to={getUrlOr404S(row.url)} >{text}</NavLink>
                },
                {
                    ...getColumn('Manager', 'manager'),
                    filters: managers,
                    render: manager => (manager ? manager.username : '--')
                },
                {
                    ...getColumn('Company', 'company.name'),
                    render: (name, row) => (row.company
                            ? <NavLink to={getUrlOr404S(row.company.url)} >{name}</NavLink>
                            : '--'
                    )
                },
                {
                    ...getColumn('Address', 'company.custom_company_address'),
                    render: (address, row) => (row.use_custom_address
                            ? <Popover content={row.company.address} title="Custom address"><Button type={'link'}>{row.custom_company_address.substr(0,10)}...</Button></Popover>
                            : row.company
                                ? <Popover content={row.company.address} title="Company address"><Button type={'link'}>{row.company.address.substr(0,10)}...</Button></Popover>
                                : '--'
                    )
                },
                {...getColumn('Alexa status', 'alexa_status'),},
                {...getColumn('Alexa comment', 'alexa_comment'),},
                {...getColumn('Redirect', 'redirect'),},
                {...getColumn('Register date', 'register_date'),},
                {...getColumn('Expire date', 'expire_date'),},
                {...getColumn('Status', 'status'),},
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
