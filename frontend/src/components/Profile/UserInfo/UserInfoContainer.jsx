import React, {useState} from 'react'
import {connect} from "react-redux";
import "antd/dist/antd.css";
import UserInfo from "./UserInfo";
import {updateUserProfile} from "../../../redux/user-reducer";
import UserInfoForm from "./UserInfoForm/UserInfoForm";
import css from "../Profile.module.css";
import {BoxTitle} from "../BoxTitle/BoxTitle";
import {Box} from "../Box/Box";

const UserInfoContainer = (props) => {

    const label_size = 4;
    const text_size = 20;

    let [editMode, setEditMode] = useState(false);

    const activateEditMode = () => {
        setEditMode(true)
    };
    const deActivateEditMode = () => {
        setEditMode(false)
    };

    const colSize = 12;
    const gutters = 16;
    const vgutters = 16;

    const username=props.username;
    const email=props.email;
    const jabber_nick= props.profile.jabber_nick;
    const _props = {
        gutters, vgutters, label_size, text_size, username, email, jabber_nick,
        colSize
    };

    return (
        <Box onClickMethod={editMode ? deActivateEditMode : activateEditMode}
             boxTitleText={'User info'}
             icon={editMode ? 'close-circle': 'edit'}
        >
            {!editMode && <UserInfo
                {..._props}
                activateEditMode={activateEditMode}
            />}

            {editMode && <UserInfoForm
                {..._props}
                deActivateEditMode={deActivateEditMode}
                updateUserProfile={props.updateUserProfile}
            />}

        </Box>
    )
};

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth,
    user: state.user,
    pk: state.user.pk,
    username: state.user.username,
    email: state.user.email,
    profile: state.user.profile,
    settings: state.user.settings,
});

export default connect(mapStateToProps, {updateUserProfile})(UserInfoContainer)
