import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import DomainForm from "./DomainForm";
import {domainCreate} from "../../redux/domain-reducer";
import {additionalDomainProps} from "../../hoc/additionalDomainProps";
import {getCurrentUserS} from "../../selectors/users-selectors";
import {submitCreateUpdateForm} from "../../utils/utils";


const DomainCreateContainer = (props) => {
    const {getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;
    const {
        currentUser, formErrors, managers, statuses, alexa_statuses, companies,
        domainCreate
    } = props;

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, domainCreate);
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
});

export default compose(
    withAuthRedirect,
    additionalDomainProps,
    connect(mapStateToProps, {domainCreate})
)(DomainCreateComponent);
