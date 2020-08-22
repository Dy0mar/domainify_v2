import React, {useEffect, useState} from 'react'
import {Divider, Icon, Row, Col, Table, Popover, Button, Input} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {connect} from "react-redux"
import {NavLink, withRouter} from "react-router-dom"
import {getDomainList} from "../../redux/domain-reducer"
import {
    getDomainIsLoadingS,
    getDomainListPageTotalS,
    getDomainListS, getUrlOr404S
} from "../../redux/domains-selectors"
import style from "./Domains.module.css"
import {getManagerListS} from "../../redux/users-selectors"
import Highlighter from 'react-highlight-words'

const DomainsContainer = (props) => {
    const {domains, managers, total, isLoading} = props
    const {getDomainList} = props

    const [filteredTotal] = useState(total)

    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')


    // load
    useEffect(() => {
        getDomainList()
    }, [getDomainList])


    const onApplyFilter = (pagination, filters, sorter, extra) => {
        getDomainList(pagination.current, filters)
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }
    const handleReset = clearFilters => {
        clearFilters()
        setSearchText('')
    }

    const [config, setConfig] = useState({})
    useEffect(() => {
        const getColumn = (title, field) => ({title: title, dataIndex: field, key: field})
        const getColumnSearchProps = dataIndex => ({

            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
            filterIcon: filtered => (
              <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) => {
                if (searchedColumn === 'telephones'){
                    let a = record[dataIndex].map(i => i.telephone
                      .toString()
                      .toLowerCase()
                    ).join(', ')
                      console.log(a)

                      return a.includes(value.toLowerCase())
                } else
                    record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
            },

            render: text =>
              searchedColumn === dataIndex ? (
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={text.toString()}
                />
              ) : (
                text
              ),
        })

        setConfig({
            bordered: true,
            pagination : {
                total: filteredTotal,
                pageSize: 10,
                position: filteredTotal >= 10 ? 'bottom' : 'none'
            },
            loading: isLoading,
            rowClassName: record => style['highlight'+record.status],
            columns: [
                {
                    ...getColumn('Name', 'name'),
                    ...getColumnSearchProps('name'),
                    render: (text, row) => <NavLink to={getUrlOr404S(row.url)} >{text}</NavLink>
                },
                {
                    ...getColumn('Phones', 'telephones'),
                    ...getColumnSearchProps('telephones'),
                    render: (text, row) => (row.telephones
                      ? row.telephones.map(i => i.telephone + ' ')
                      : '--')
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
    }, [isLoading, domains, filteredTotal, managers, searchedColumn, searchText])

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
}

const mapStateToProps = (state) => ({
    domains: getDomainListS(state),
    total: getDomainListPageTotalS(state),
    isLoading: getDomainIsLoadingS(state),
    managers: getManagerListS(state),
})

export default compose(
  withAuthRedirect,
  withRouter,
  connect(mapStateToProps, {getDomainList})
)(DomainsContainer)
