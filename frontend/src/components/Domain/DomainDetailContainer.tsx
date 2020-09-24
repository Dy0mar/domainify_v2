import React, {useEffect, useState} from 'react'
import {Divider, Modal} from 'antd'
import "antd/dist/antd.css"
import {compose} from "redux"
import {withAuthRedirect} from "../../hoc/withAuthRedirect"
import {useDispatch, useSelector} from "react-redux"
import {useParams} from "react-router-dom"
import {
    actualize_whois,
    deleteDomain,
    loadCurrentDomain,
} from "../../redux/domain-reducer"
import {DomainInfoContainer} from "./DomainComponents/DomainInfoContainer"
import {getCurrentDomainS} from "../../selectors/domains-selectors"
import {getIsLoadingS} from "../../selectors/app-selector"


const { confirm } = Modal

const DomainDetailContainer = () => {
    const [isLoad, setIsLoad] = useState(true)
    const currentDomain = useSelector(getCurrentDomainS)
    const isLoading = useSelector(getIsLoadingS)

    const dispatch = useDispatch()

    const {domainId} = useParams<{domainId: string}>()
    const pk = parseInt(domainId)


    const load = () => {
        dispatch(loadCurrentDomain(pk))
    }
    useEffect(load, [])

    useEffect(() => {
        if (currentDomain?.name)
          setIsLoad(false)
    }, [currentDomain])


    const actuator = () => {
        dispatch(actualize_whois(pk))
    }

    function deleteConfirm() {
        confirm({
            title: `Are you sure delete ${currentDomain.name}?`,
            content: 'One does not simply, need confirm.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch(deleteDomain(pk))
            },
            onCancel() {},
        })
    }

    const editLink = `/domains/${domainId}/edit/`
    return (
        <div>
            <Divider>Domain detail</Divider>
            {!isLoad &&

            <DomainInfoContainer
              isLoading={isLoading}
              domain={currentDomain}
              deleteConfirm={deleteConfirm}
              editLink={editLink}
              actuator={actuator}
            />
            }
        </div>
    )
}

export default compose(withAuthRedirect)(DomainDetailContainer)
