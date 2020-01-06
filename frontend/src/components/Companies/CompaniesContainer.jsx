import React from 'react'
import {Divider, Row, Col, Table} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {getCompanyListS} from "../../redux/company-selector";
import {getUrlOr404S} from "../../redux/domains-selectors";


const CompaniesContainer = (props) => {
    const { companies } = props;

    const config = {
        dataSource: companies,
        rowKey: item => item.pk,
        columns: [
            {
                title: 'Company name',
                dataIndex: 'name',
                key: 'name',
                render: (name, row) => <NavLink to={getUrlOr404S(row.url)} >{name}</NavLink>
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
        ],
    };

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
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {})
)(CompaniesContainer);
