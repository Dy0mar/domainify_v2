import React, {useEffect} from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import DomainForm from "./DomainForm";
import {
    getCurrentUserS,
    getManagersListS,
    getUserListS
} from "../../redux/users-selectors";
import {getManagersList} from "../../redux/user-reducer";


const DomainCreateContainer = (props) => {
    const {getFieldDecorator, validateFields} = props.form;
    const {getManagersList, users, currentUser, managers} = props;
    useEffect(() => {
        getManagersList()
    }, [getManagersList]);

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {
                console.log(values)
            }
        });
    };
    const _props = { users, currentUser, managers };
    return (
        <div>
            <Divider>Domain create</Divider>
            <DomainForm {..._props}
                        onSubmit={onSubmit}
                        getFieldDecorator={getFieldDecorator}
            />
        </div>
    )
};

const DomainCreateComponent = Form.create({ name: 'login_form',  })(DomainCreateContainer);

const mapStateToProps = (state) => ({
    createFormErrors: state.domains.createFormErrors,
    users: getUserListS(state),
    managers: getManagersListS(state),
    currentUser: getCurrentUserS(state)
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {getManagersList})
)(DomainCreateComponent);
