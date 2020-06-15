import React from 'react'
import {Button, Row} from 'antd'
import "antd/dist/antd.css"
import {Box} from "../Common/Box/Box"
import {NavLink} from "react-router-dom"


const SettingsBox = (props) => {
    const {getBoxIfEmpty, getNewItem} = props
    const {objectList, createLink, boxTitleText} = props

    return (
        <Box boxTitleText={boxTitleText} icon={'info-circle'} onClickMethod={null}>
            {!!objectList.length && objectList.map((item, index) => getNewItem(item, index))}

            {!objectList.length && getBoxIfEmpty()
            }
            <Row>
                <NavLink to={createLink}>
                    <Button style={{marginTop: 10}} type="primary">add new</Button>
                </NavLink>
            </Row>
        </Box>
    )
}

export default SettingsBox
