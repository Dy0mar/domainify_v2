import React from 'react'
import {Divider, Row, Col, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {withRouter} from "react-router-dom";
import CompanyForm from "./CompanyForm";
import {getCompanyByIdS} from "../../redux/company-selector";
import {submitCreateUpdateForm} from "../../utils/utils";
import {updateCompany} from "../../redux/company-reducer";


const CompanyEditContainer = (props) => {
    const {companyId} = props.match.params;
    const {getFieldDecorator, validateFields } = props.form;
    const {formErrors, company} = props;

    const onSubmit = (e) => {
        e.preventDefault();
        submitCreateUpdateForm(validateFields, props.updateCompany, companyId);
    };
    const cancelLink = '/companies';

    const _props = {
        cancelLink, company, getFieldDecorator, formErrors, onSubmit
    };
    return (
        <div>
            <Divider>Company edit</Divider>
            <Row>
                <Col span={24}>
                    <CompanyForm {..._props}/>
                </Col>
            </Row>
        </div>
    )
};

const CompanyEditComponent = Form.create({ name: 'company_edit_form',  })(CompanyEditContainer);

const mapStateToProps = (state, ownProps) => {
    const { companyId } = ownProps.match.params;
    return {
        formErrors: state.companies.formErrors,
        company: getCompanyByIdS(state, companyId)
    }
};

export default compose(
    withAuthRedirect,
    withRouter,
    connect(mapStateToProps, {updateCompany})
)(CompanyEditComponent);
