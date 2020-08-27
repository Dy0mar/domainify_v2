import React from "react";
import {connect} from "react-redux";
import {getManagerListS} from "../redux/users-selectors";
import {
    getAlexaStatusListS,
    getDomainStatusListS
} from "../selectors/domains-selectors";
import {getCompanyListS} from "../selectors/company-selector";

const mapStateToProps = (state) => ({
    formErrors: state.domains.formErrors,
    managers: getManagerListS(state),
    statuses: getDomainStatusListS(state),
    companies: getCompanyListS(state),
    alexa_statuses: getAlexaStatusListS(state),
});

export const additionalDomainProps = (Component) => {
    const wrapper = (props) => {

        return <Component {...props}/>
    };

    const wrapperComponent = connect(mapStateToProps)(wrapper);

    return wrapperComponent
};
