import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import DomainForm from "./DomainForm";
import {domainCreate} from "../../redux/domain-reducer";
import {additionalDomainProps} from "../../hoc/additionalDomainProps";
import {getCurrentUserS} from "../../redux/users-selectors";
import {redirectHoc} from "../../hoc/redirectTo";
import {submitCreateUpdateForm} from "../../utils/utils";
import {setRedirectTo} from "../../redux/app-reducer";


const DomainCreateContainer = (props) => {
    const {getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;
    const {
        currentUser, formErrors, managers, statuses, alexa_statuses, companies,
    } = props;

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, props.domainCreate);
    };

    const _props = {
        currentUser, formErrors, managers, statuses, alexa_statuses, companies,
        onSubmit, getFieldDecorator, getFieldValue, setFieldsValue
    };
    return (
        <div>
            <Divider>Domain create</Divider>
            <DomainForm {..._props}
                        initManagerValuePk={currentUser.pk}
                        cancelLink={'/domains'}
            />
        </div>
    )
};

const DomainCreateComponent = Form.create({ name: 'domain_create_form', })(DomainCreateContainer);

const mapStateToProps = (state) => ({
    currentUser: getCurrentUserS(state),
    redirectTo: state.domains.redirectTo,
});

export default compose(
    withAuthRedirect,
    redirectHoc,
    additionalDomainProps,
    connect(mapStateToProps, {domainCreate, setRedirectTo})
)(DomainCreateComponent);
