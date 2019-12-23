import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Typography, Tag} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {getDomainList} from "../../redux/domain-reducer";
import {
    getDomainListPageTotalS,
    getDomainListS, getUrlOr404S
} from "../../redux/domains-selectors";

const {Text} = Typography;

const DomainsContainer = (props) => {
    const {domains, total, getDomainList} = props;

    const [page, setPage] = useState(1);
    useEffect(() => {
        getDomainList(page)
    }, [page, getDomainList]);

    const changePage = (page) => {
        setPage(page);
    };

    const [loading, setLoading] = useState(!domains.length);
    useEffect(()=>{
        setLoading(!domains.length)
    }, [domains.length]);

    const [config, setConfig] = useState({});
    useEffect(() => {
        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 10,
                onChange: changePage,
                position: total >= 10 ? 'bottom' : 'none'
            },
            loading: loading,
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
                    render: manager => <NavLink to={getUrlOr404S(manager.url)} >{manager.username}</NavLink>
                },
                {
                    title: 'Company name',
                    dataIndex: 'company_name',
                    key: 'company_name',
                },
                {
                    title: 'Company address',
                    dataIndex: 'company_address',
                    key: 'company_address',
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
            dataSource: domains,
            rowKey: d => d.name
        })
    }, [page, loading, domains, total]);

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
    total: getDomainListPageTotalS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getDomainList})
)(DomainsContainer);
