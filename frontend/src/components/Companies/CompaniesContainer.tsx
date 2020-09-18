import React, {useEffect, useState} from 'react'
import {Button, Col, Divider, Modal, Row, Table} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {useDispatch, useSelector} from "react-redux"
import {NavLink} from "react-router-dom"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {getCompanyListS} from "../../selectors/company-selector"
import {getIsLoadingS, getUrlOr404S} from "../../selectors/app-selector"
import {deleteCompany} from "../../redux/company-reducer"
import {TCompany} from "../../types/g-types"

const { confirm } = Modal


const CompaniesContainer = () => {
    const companies = useSelector(getCompanyListS)
    const isLoading = useSelector(getIsLoadingS)

    const dispatch = useDispatch()
    
    const [config, setConfig] = useState({})

    useEffect(() => {
        const deleteConfirm = (company: TCompany) => {
            confirm({
                title: `Are you sure delete ${company.name}?`,
                content: 'One does not simply, need confirm',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    dispatch(deleteCompany(company.pk))
                },
                onCancel() {},
            })
        }

        const getColumn = (title: string, field: string) => ({title: title, dataIndex: field, key: field})

        setConfig({
            bordered: true,
            dataSource: companies,
            rowKey: (row: TCompany) => row.pk,
            loading: isLoading,

            columns: [
                {
                    ...getColumn('Company name', 'name'),
                    render: (name: string, row: TCompany) => <NavLink to={getUrlOr404S(row.url)} >{name}</NavLink>
                },
                {...getColumn('Address', 'address'),},
                {
                    title: 'Action',
                    render: (row: TCompany) => <span style={{textAlign: 'center'}}>
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
    }, [companies, isLoading, dispatch])


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


export default compose(withAuthRedirect)(CompaniesContainer)
