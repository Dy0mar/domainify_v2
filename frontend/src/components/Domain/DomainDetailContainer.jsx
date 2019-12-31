import React from 'react'
import {Divider, Form} from 'antd';
import "antd/dist/antd.css";
import {compose} from "redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
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


const DomainDetailContainer = (props) => {

    return (
        <div>
            <Divider>Domain detail</Divider>
        </div>
    )
};

const DomainDetailComponent = Form.create({ name: 'domain_edit_form',  })(DomainDetailContainer);

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
    connect(mapStateToProps)
)(DomainDetailComponent);
