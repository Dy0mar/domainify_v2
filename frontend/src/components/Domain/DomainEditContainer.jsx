import React, {useEffect, useState} from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {loadCurrentDomain, updateDomain} from "../../redux/domain-reducer";
import DomainForm from "./DomainForm";
import {additionalDomainProps} from "../../hoc/additionalDomainProps";
import {redirectHoc} from "../../hoc/redirectTo";


const DomainDetailContainer = (props) => {
    const {getFieldDecorator, validateFields, getFieldValue, setFieldsValue } = props.form;
    const {currentDomain, loadCurrentDomain} = props;
    const {domainId} = props.match.params;

    const [initManagerValuePk, setInitManagerValuePk] = useState(null);

    useEffect(() => {
        if (props.currentDomain.manager)
            setInitManagerValuePk(props.currentDomain.manager.pk)
    }, [props.currentDomain]);

    useEffect(() => {
        loadCurrentDomain(domainId)
    }, [loadCurrentDomain, domainId]);

    const onSubmit = (e) => {
        e.preventDefault();

        validateFields((err, values) => {
            if (!err) {

                const data = {
                    ...values,
                    pk: domainId,
                    manager: {pk: values.manager},
                    company: {pk: values.company}
                };
                props.updateDomain(data);
            }
        });
    };

    return (
        <div>
            <Divider>Domain detail</Divider>
            <DomainForm {...props} {...currentDomain}
                        onSubmit={onSubmit}
                        getFieldDecorator={getFieldDecorator}
                        getFieldValue={getFieldValue}
                        setFieldsValue={setFieldsValue}
                        initManagerValuePk={initManagerValuePk}

            />
        </div>
    )
};

const DomainDetailComponent = Form.create({ name: 'domain_edit_form',  })(DomainDetailContainer);

const mapStateToProps = (state) => ({
    currentDomain: state.domains.currentDomain
});

export default compose(
    withAuthRedirect,
    withRouter,
    redirectHoc,
    additionalDomainProps,
    connect(mapStateToProps, {loadCurrentDomain, updateDomain}),
)(DomainDetailComponent);
