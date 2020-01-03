import React from "react";
import {connect} from "react-redux";
import {getManagerListS} from "../redux/users-selectors";
import {
    getAlexaStatusListS,
    getCompanyListS,
    getDomainStatusListS
} from "../redux/domains-selectors";

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
