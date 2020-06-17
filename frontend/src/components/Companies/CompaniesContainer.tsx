import React, {useEffect, useState} from 'react'
import {Divider, Row, Col, Table, Button, Modal} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {connect} from "react-redux"
import {NavLink, withRouter} from "react-router-dom"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {
    getAbsoluteUrlOr404S,
    getCompanyListS
} from "../../redux/company-selector"
import {getIsLoadingS} from "../../redux/app-selector"
import {deleteCompany, getCompanyList} from "../../redux/company-reducer"
import {TAppState} from "../../redux/redux-store"
import {TCompany} from "../../types/g-types"

const { confirm } = Modal

const CompaniesContainer: React.FC<TMapProps & TDispatchProps> = (props) => {
    const { companies, isLoading, total, getCompanyList, deleteCompany} = props

    const [config, setConfig] = useState({})
    useEffect(() => {
        getCompanyList()
    }, [getCompanyList])


    useEffect(() => {
        const deleteConfirm = (company: TCompany) => {
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
            })
        }
        const getColumn = (title: string, field: string) => ({title: title, dataIndex: field, key: field})

        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 100,
                position: total >= 10 ? 'bottom' : 'none'
            },
            dataSource: isLoading ? [] : companies,
            rowKey: (item: TCompany) => item.pk,
            loading: isLoading,

            columns: [
                {
                    ...getColumn('Company name', 'name'),
                    render: (name: string, row: TCompany) => <NavLink to={getAbsoluteUrlOr404S(row.url)} >{name}</NavLink>
                },
                {...getColumn('Address', 'address'),},
                {
                    title: 'Action',
                    render: (row: TCompany) => <span style={{textAlign: 'center'}}>
                        <NavLink to={getAbsoluteUrlOr404S(row.url) + 'edit/'} >
                            <Button type="primary" icon={'edit'}> Edit </Button>
                        </NavLink>
                        <Button type="danger" icon={'delete'} style={{marginLeft: 10}} onClick={() => deleteConfirm(row)}>
                            Delete
                        </Button>
                    </span>
                },
            ],
        })
    }, [companies, isLoading, total, deleteCompany])

    return (
        <div>
            <Divider>Companies here / <NavLink to={'companies/create/'} >Add company</NavLink></Divider>
            <Row>
                <Col span={24}>
                    <Table {...config} />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state: TAppState): TMapProps => ({
    companies: getCompanyListS(state),
    isLoading: getIsLoadingS(state),
    total: state.companies.count,
})

type TMapProps = {
    companies: Array<TCompany>
    isLoading: boolean
    total: number
}

export type TDispatchProps = {
    deleteCompany: (pk: number) => void
    getCompanyList: () => void
}

export default compose(
    withAuthRedirect,
    withRouter,
    connect<TMapProps, TDispatchProps, {}, TAppState>(mapStateToProps, {getCompanyList, deleteCompany})
)(CompaniesContainer)
