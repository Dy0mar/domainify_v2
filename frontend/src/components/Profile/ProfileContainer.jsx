import React, {useState} from 'react'
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import UserInfo from "./UserInfo/UserInfo";
import {updateUserProfile} from "../../redux/user-reducer";
import UserInfoForm from "./UserInfoForm/UserInfoForm";


const ProfileContainer = (props) => {
    /*
    let onChangeField = (fields) => {
        const wrap = (value) => {
             let data = {};
             let old_key = '';

             for (let key of fields) {
                 if (old_key){
                     data[old_key] = {[key]: value};
                 } else {
                     data = Object.assign({}, {[key]: value});
                     old_key = key
                 }
             }
            props.updateUserProfile(data);
        };
        return wrap
    };
    const onChangeEmail = onChangeField(['email']);
    const onChangePidgin = onChangeField(['profile', 'pidgin']);
    */

    let [editMode, setEditMode] = useState(false);

    const activateEditMode = () => {
        setEditMode(true)
    };
    const deActivateEditMode = () => {
        setEditMode(false)
    };

    const gutters = 16;
    const vgutters = 16;

    return (
        <div>
            <Divider>Profile here</Divider>
            <Row>
                <Col span={12}>

                    {!editMode && <UserInfo
                        username={props.username}
                        email={props.email}
                        jabber_nick={props.profile.jabber_nick}
                        activateEditMode={activateEditMode}
                        gutters={gutters}
                        vgutters={vgutters}
                    />}

                    {editMode && <UserInfoForm
                        deActivateEditMode={deActivateEditMode}
                        username={props.username}
                        email={props.email}
                        jabber_nick={props.profile.jabber_nick}
                        gutters={gutters}
                        vgutters={vgutters}
                        updateUserProfile={props.updateUserProfile}
                    />}
                </Col>
            </Row>
        </div>
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

export default compose(
    withAuthRedirect,
    connect(mapStateToProps, {updateUserProfile}),
)(ProfileContainer);
