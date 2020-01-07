import React from 'react'
import {Divider, Row, Col, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import CompanyForm from "./CompanyForm";
import {submitCreateUpdateForm} from "../../utils/utils";
import {createCompany} from "../../redux/company-reducer";


const CompanyCreateContainer = (props) => {
    const {getFieldDecorator, validateFields } = props.form;
    const {formErrors} = props;

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, props.createCompany);
    };
    const cancelLink = '/companies';

    const _props = {
        cancelLink, getFieldDecorator, formErrors, onSubmit
    };
    return (
        <div>
            <Divider>Company add</Divider>
            <Row>
                <Col span={24}>
                    <CompanyForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
};

const CompanyCreateComponent = Form.create({ name: 'company_add_form',  })(CompanyCreateContainer);

const mapStateToProps = (state) => ({
    formErrors: state.companies.formErrors,
});

export default compose(
    withAuthRedirect,
    connect(mapStateToProps, {createCompany})
)(CompanyCreateComponent);
