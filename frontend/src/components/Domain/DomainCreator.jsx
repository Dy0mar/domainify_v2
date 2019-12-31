import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import DomainForm from "./DomainForm";
import {
    getCurrentUserS,
    getManagerListS,
    getUserListS
} from "../../redux/users-selectors";
import {
    getAlexaStatusListS,
    getCompanyListS,
    getDomainStatusListS
} from "../../redux/domains-selectors";
import {domainCreate, setRedirectTo} from "../../redux/domain-reducer";


const DomainCreateContainer = (props) => {
    const {getFieldDecorator, validateFields} = props.form;
    const {
        users, currentUser, managers, statuses, alexa_statuses, companies, createFormErrors
    } = props;

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {

                const data = {
                    ...values,
                    manager: {pk: values.manager},
                    company: {pk: values.company}
                };
                props.domainCreate(data);
            }
        });
    };

    const redirectTo = () => {
        props.setRedirectTo('');
        return <Redirect to={props.redirectTo} />
    };

    const _props = {
        users, currentUser, managers, statuses, alexa_statuses, companies,
        createFormErrors,
    };
    return (
        <> {props.redirectTo && redirectTo()}
        <div>
            <Divider>Domain create</Divider>
            <DomainForm {..._props}
                        onSubmit={onSubmit}
                        getFieldDecorator={getFieldDecorator}
            />
        </div>
        </>
    )
};

const DomainCreateComponent = Form.create({ name: 'domain_create_form',  })(DomainCreateContainer);

const mapStateToProps = (state) => ({
    createFormErrors: state.domains.createFormErrors,
    users: getUserListS(state),
    managers: getManagerListS(state),
    statuses: getDomainStatusListS(state),
    companies: getCompanyListS(state),
    alexa_statuses: getAlexaStatusListS(state),
    currentUser: getCurrentUserS(state),
    redirectTo: state.domains.redirectTo,
});

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {domainCreate, setRedirectTo})
)(DomainCreateComponent);
