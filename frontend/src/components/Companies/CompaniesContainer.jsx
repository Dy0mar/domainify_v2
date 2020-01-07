import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {
    getAbsoluteUrlOr404S,
    getCompanyListS
} from "../../redux/company-selector";
import {getIsLoadingS} from "../../redux/app-selector";


const CompaniesContainer = (props) => {
    const { companies, isLoading, total } = props;

    const [config, setConfig] = useState({});

    useEffect(() => {
        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 100,
                position: total >= 10 ? 'bottom' : 'none'
            },
            dataSource: isLoading ? [] : companies,
            rowKey: item => item.pk,
            loading: isLoading,

            columns: [
                {
                    title: 'Company name',
                    dataIndex: 'name',
                    key: 'name',
                    render: (name, row) => <NavLink to={getAbsoluteUrlOr404S(row.url)} >{name}</NavLink>
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                },
            ],
        })
    }, [companies, isLoading, total]);

    return (
        <div>
            <Divider>Companies here</Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} />
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    companies: getCompanyListS(state),
    isLoading: getIsLoadingS(state),
    total: state.companies.count,
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {})
)(CompaniesContainer);
