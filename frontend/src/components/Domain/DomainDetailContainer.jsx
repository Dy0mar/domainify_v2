import React, {useEffect} from 'react'
import {Divider, Modal} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"
import {
    deleteDomain,
    loadCurrentDomain,
    updateDomain
} from "../../redux/domain-reducer"
import DomainInfoContainer from "./DomainComponents/DomainInfoContainer"
import {redirectHoc} from "../../hoc/redirectTo"


const { confirm } = Modal

const DomainDetailContainer = (props) => {

    const {currentDomain, loadCurrentDomain} = props
    const {domainId} = props.match.params
    const editLink = '/domains/'+domainId+'/edit/'

    useEffect(() => {
        loadCurrentDomain(domainId)
    }, [loadCurrentDomain, domainId])


    function deleteConfirm() {
        confirm({
            title: `Are you sure delete ${currentDomain.name}?`,
            content: 'One does not simply, need confirm.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                props.deleteDomain(domainId)
            },
            onCancel() {},
        })
    }

    return (
        <div>
            <Divider>Domain detail</Divider>
            <DomainInfoContainer domain={currentDomain} deleteConfirm={deleteConfirm} editLink={editLink}/>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentDomain: state.domains.currentDomain
})

export default compose(
    withAuthRedirect,
    withRouter,
    redirectHoc,
    connect(mapStateToProps, {loadCurrentDomain, updateDomain, deleteDomain})
)(DomainDetailContainer)
