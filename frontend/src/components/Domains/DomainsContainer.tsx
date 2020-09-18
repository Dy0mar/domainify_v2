import React, {useEffect, useState} from 'react'
import {Divider, Icon, Row, Col, Table, Popover, Button, Input} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {useDispatch, useSelector} from "react-redux"
import {NavLink} from "react-router-dom"
import {getDomainList} from "../../redux/domain-reducer"
import {
    getDomainListPageTotalS,
    getDomainListS
} from "../../selectors/domains-selectors"
import style from "./Domains.module.css"
import {getManagerListS} from "../../selectors/users-selectors"
import Highlighter from 'react-highlight-words'
import {getIsLoadingS, getUrlOr404S} from "../../selectors/app-selector"
import {TDomain, TManager, TTelephones} from "../../types/g-types";
import {PaginationConfig} from "antd/lib/pagination";

const DomainsContainer = () => {
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const domains = useSelector(getDomainListS)
    const total = useSelector(getDomainListPageTotalS)
    const isLoading = useSelector(getIsLoadingS)
    const managers = useSelector(getManagerListS)

    const dispatch = useDispatch()

    const initDomains = () => {
        dispatch(getDomainList())
    }

    useEffect(initDomains, [])

    const onApplyFilter = (pagination: PaginationConfig, filters: any) => {
        dispatch(getDomainList(pagination.current, filters))
    }

    const [config, setConfig] = useState({})
    useEffect(() => {
        const handleSearch = (selectedKeys: any, confirm: any, dataIndex: string) => {
            confirm()
            setSearchText(selectedKeys[0])
            setSearchedColumn(dataIndex)
        }

        const handleReset = (clearFilters: any) => {
            clearFilters()
            setSearchText('')
        }
        const getColumn = (title: string, field: string) => ({title: title, dataIndex: field, key: field})
        const getColumnSearchProps = (dataIndex: string) => ({

            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }:
                                 {setSelectedKeys: any, selectedKeys: any, confirm: any, clearFilters: any}) => (
              <div style={{ padding: 8 }}>
                  <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                  >
                      Search
                  </Button>
                  <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                      Reset
                  </Button>
              </div>
            ),
            filterIcon: (filtered: boolean) => (
              <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value: string, row: any) => {
                if (searchedColumn === 'telephones'){

                    const a = row[dataIndex].map((i: any) => i.telephone
                      .toString()
                      .toLowerCase()
                    ).join(', ')

                    return a.includes(value.toLowerCase())
                } else
                    return row[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
            },

            render: (text: string) =>
              searchedColumn === dataIndex ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[searchText + '123']}
                  autoEscape
                  textToHighlight={text.toString() + '123'}
                />
              ) : (
                text
              ),
        })

        setConfig({
            bordered: true,
            pagination : {
                total: total,
                pageSize: 10,
                position: total >= 10 ? 'bottom' : 'none'
            },
            loading: isLoading,
            rowClassName: (row: TDomain) => style['highlight' + row.status],
            columns: [
                {
                    ...getColumn('Name', 'name'),
                    ...getColumnSearchProps('name'),
                    render: (text: string, row: TDomain) => <NavLink to={getUrlOr404S(row.url)} >{text}</NavLink>
                },
                {
                    ...getColumn('Phones', 'telephones'),
                    ...getColumnSearchProps('telephones'),
                    render: (text: string, row: TDomain) => (row.telephones
                      ? row.telephones.map((i: TTelephones) => i.telephone + ' ')
                      : '--')
                },
                {
                    ...getColumn('Manager', 'manager'),
                    filters: managers,
                    render: (manager: TManager) => (manager ? manager.username : '--')
                },
                {
                    ...getColumn('Company', 'company.name'),
                    render: (name: string, row: TDomain) => (row.company
                        ? <NavLink to={getUrlOr404S(row.company.url)} >{name}</NavLink>
                        : '--'
                    )
                },
                {
                    ...getColumn('Address', 'company.custom_company_address'),
                    render: (address: string, row: TDomain) => (row.use_custom_address
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
            rowKey: (row: TDomain) => row.name
        })
    }, [isLoading, domains, managers, searchedColumn, searchText, total])

    return (
      <div>
          <Divider>Domains here / <NavLink to={'domains/create/'} >Add domain</NavLink></Divider>
          <Row>
              <Col span={24}>
                  <Table {...config} onChange={onApplyFilter}/>
              </Col>
          </Row>
      </div>
    )
}


export default compose(withAuthRedirect)(DomainsContainer)
