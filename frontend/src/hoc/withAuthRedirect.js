import React from "react";
import {connect} from "react-redux";
import {initializeApp} from "../redux/app-reducer";
import Preloader from "../components/Common/Preloader/Preloader";
import {Redirect} from "react-router-dom";

let mapStateToPropsForRedirect = (state) => ({
    initialized: state.app.initialized,
    isAuth: state.auth.isAuth,
});

export const withAuthRedirect = (Component) => {
    class RedirectComponent extends React.Component {

        componentDidMount() {
            this.props.initializeApp();
        }

        render(){
            if(!this.props.initialized) return <Preloader />;

            if (!this.props.isAuth) return <Redirect to='/login' />;

            return <Component {...this.props}/>
        }
    }

    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect, {initializeApp})(RedirectComponent);

    return ConnectedAuthRedirectComponent
};
