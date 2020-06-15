import React, {useState} from 'react'
import {connect} from "react-redux"
import "antd/dist/antd.css"
import UserInfo from "./UserInfo"
import {
    checkNotificationMethod,
    updateUserProfile
} from "../../../redux/user-reducer"
import UserInfoForm from "./UserInfoForm/UserInfoForm"
import {Box} from "../../Common/Box/Box"

const UserInfoContainer = (props) => {

    const [editMode, setEditMode] = useState(false)

    const activateEditMode = () => {
        setEditMode(true)
    }
    const deActivateEditMode = () => {
        setEditMode(false)
    }

    const username=props.username
    const email=props.email
    const jabber_nick= props.profile.jabber_nick
    const handleOnclick = (method) => {
        props.checkNotificationMethod(method)
    }
    const _props = { username, email, jabber_nick }

    return (
        <Box onClickMethod={editMode ? deActivateEditMode : activateEditMode}
             boxTitleText={'User info'}
             icon={editMode ? 'close-circle': 'edit'}
        >
            {!editMode && <UserInfo
                {..._props}
                handleOnclick={handleOnclick}
                activateEditMode={activateEditMode}
            />}

            {editMode && <UserInfoForm
                {..._props}
                deActivateEditMode={deActivateEditMode}
                updateUserProfile={props.updateUserProfile}
            />}

        </Box>
    )
}

const mapStateToProps = (state) => ({
    username: state.user.username,
    email: state.user.email,
    profile: state.user.profile,
})

export default connect(mapStateToProps, {
    updateUserProfile, checkNotificationMethod
})(UserInfoContainer)
