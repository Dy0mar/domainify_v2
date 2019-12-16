import React, {useState} from 'react'
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {Divider, Row, Col} from 'antd';
import "antd/dist/antd.css";
import UserInfo from "./UserInfo/UserInfo";
import {updateUserProfile} from "../../redux/user-reducer";
import UserInfoForm from "./UserInfoForm/UserInfoForm";
import css from "./Profile.module.css";
import {BoxTitle} from "./UserInfoBoxTitle/BoxTitle";


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
    const label_size = 4;
    const text_size = 20;

    let [editMode, setEditMode] = useState(false);

    const activateEditMode = () => {
        setEditMode(true)
    };
    const deActivateEditMode = () => {
        setEditMode(false)
    };

    const gutters = 16;
    const vgutters = 16;
    const username=props.username;
    const email=props.email;
    const jabber_nick= props.profile.jabber_nick;
    const _props = {
        gutters, vgutters, label_size, text_size, username, email, jabber_nick
    };

    return (
        <div>
            <Divider>Profile here</Divider>
            <Row>
                <Col span={12}>
                    <section className={css.box}>
                        <section className={css.boxContainer}>

                            {!editMode && <div>
                                <BoxTitle editMode={activateEditMode} iconType={'edit'} />
                                <UserInfo
                                    {..._props}
                                    activateEditMode={activateEditMode}
                                />
                            </div>}


                            {editMode && <div>
                                <BoxTitle editMode={deActivateEditMode} iconType={'close-circle'} />
                                <UserInfoForm
                                {..._props}
                                deActivateEditMode={deActivateEditMode}
                                updateUserProfile={props.updateUserProfile}
                            />
                            </div>}
                        </section>
                    </section>
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
