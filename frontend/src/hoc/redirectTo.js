import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {setRedirectTo as domainSetRedirectTo} from "../redux/domain-reducer";
import {setRedirectTo as appSetRedirectTo} from "../redux/app-reducer";

const mapStateToProps = (state) => ({
    domainRedirectTo: state.domains.redirectTo,
    appRedirectTo: state.app.redirectTo,
});

export const redirectHoc = (Component) => {

    const wrapper = (props) => {
        const redirectTo = (path, reducer) => {
            // run after some action
            if (reducer === 'domain')
                props.domainSetRedirectTo('');

            if (reducer === 'app')
                props.appSetRedirectTo('');
            return <Redirect to={path} />
        };
        return (
            <>
                {props.domainRedirectTo && redirectTo(props.domainRedirectTo, 'domain')}
                {props.appRedirectTo && redirectTo(props.appRedirectTo, 'app')}
                <Component {...props}/>
            </>
        )
    };

    const wrapperComponent = connect(mapStateToProps, {domainSetRedirectTo, appSetRedirectTo})(wrapper);
    return wrapperComponent
};
