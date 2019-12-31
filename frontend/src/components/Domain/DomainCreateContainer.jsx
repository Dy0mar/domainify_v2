import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import DomainForm from "./DomainForm";
import {domainCreate, setRedirectTo} from "../../redux/domain-reducer";
import {additionalDomainProps} from "../../hoc/additionalDomainProps";
import {getCurrentUserS} from "../../redux/users-selectors";


const DomainCreateContainer = (props) => {
    const {getFieldDecorator, validateFields} = props.form;
    const {
        currentUser, formErrors, managers, statuses, alexa_statuses, companies,
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
        // run after create domain
        props.setRedirectTo('');
        return <Redirect to={props.redirectTo} />
    };

    const _props = {
        currentUser, formErrors, managers, statuses, alexa_statuses, companies,
        onSubmit, getFieldDecorator
    };
    return (
        <> {props.redirectTo && redirectTo()}
        <div>
            <Divider>Domain create</Divider>
            <DomainForm {..._props}
                        initManagerValuePk={currentUser.pk}
            />
        </div>
        </>
    )
};

const DomainCreateComponent = Form.create({ name: 'domain_create_form', })(DomainCreateContainer);

const mapStateToProps = (state) => ({
    currentUser: getCurrentUserS(state),
    redirectTo: state.domains.redirectTo,
});

export default compose(
    withAuthRedirect,
    additionalDomainProps,
    connect(mapStateToProps, {domainCreate, setRedirectTo})
)(DomainCreateComponent);
