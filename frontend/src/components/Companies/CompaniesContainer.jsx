import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Button, Modal} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {
    getCompanyListPageSizeS,
    getCompanyListPageTotalS,
    getCompanyListS
} from "../../selectors/company-selector";
import {getIsLoadingS, getUrlOr404S} from "../../selectors/app-selector";
import {deleteCompany, getCompanyList} from "../../redux/company-reducer";

const { confirm } = Modal;

const CompaniesContainer = (props) => {
    const { companies, isLoading, total, getCompanyList, deleteCompany, page_size
    } = props;

    const [config, setConfig] = useState({});
    useEffect(() => {
        getCompanyList()
    }, [getCompanyList]);


    useEffect(() => {
        const deleteConfirm = (company) => {
            confirm({
                title: `Are you sure delete ${company.name}?`,
                content: 'One does not simply, need confirm',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    deleteCompany(company.pk)
                },
                onCancel() {},
            });
        };
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field});

        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: page_size,
                position: total >= page_size ? 'bottom' : 'none'
            },
            dataSource: isLoading ? [] : companies,
            rowKey: item => item.pk,
            loading: isLoading,

            columns: [

                {
                    ...getColumn('Company name', 'name'),
                    render: (name, row) => <NavLink to={getUrlOr404S(row.url)} >{name}</NavLink>
                },
                {...getColumn('Address', 'address'),},
                {
                    title: 'Action',
                    render: (row) => <span style={{textAlign: 'center'}}>
                        <NavLink to={getUrlOr404S(row.url) + 'edit/'} >
                            <Button type="primary" icon={'edit'}> Edit </Button>
                        </NavLink>
                        <Button type="danger" icon={'delete'} style={{marginLeft: 10}} onClick={() => deleteConfirm(row)}>
                            Delete
                        </Button>
                    </span>
                },
            ],
        })
    }, [companies, page_size,  isLoading, total, deleteCompany]);

    const onApplyFilter = (pagination, filters, sorter, extra) => {
        getCompanyList(pagination.current)
    }

    return (
        <div>
            <Divider>Companies here / <NavLink to={'companies/create/'} >Add company</NavLink></Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} onChange={onApplyFilter} />
                </Col>
            </Row>
        </div>
    )
};

const mapStateToProps = (state) => ({
    companies: getCompanyListS(state),
    isLoading: getIsLoadingS(state),
    total: getCompanyListPageTotalS(state),
    page_size: getCompanyListPageSizeS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getCompanyList, deleteCompany})
)(CompaniesContainer);
