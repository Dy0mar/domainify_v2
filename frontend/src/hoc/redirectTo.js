import React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {setRedirectTo} from "../redux/domain-reducer";

let mapStateToProps = (state) => ({
    domainRedirectTo: state.domains.redirectTo,
});

export const redirectHoc = (Component) => {

    const wrapper = (props) => {
        const redirectTo = (path) => {
            // run after some action
            props.setRedirectTo('');
            return <Redirect to={path} />
        };
        return (
            <> {props.domainRedirectTo && redirectTo(props.domainRedirectTo)}
                <Component {...props}/>
            </>
        )
    };

    let wrapperComponent = connect(mapStateToProps, {setRedirectTo})(wrapper);
    return wrapperComponent
};
