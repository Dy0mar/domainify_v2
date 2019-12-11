import React from "react";
import {connect} from "react-redux";
import Login from "../components/Login/Login";
import {initializeApp} from "../redux/app-reducer";
import Preloader from "../components/Common/Preloader/Preloader";

let mapStateToPropsForRedirect = (state) => ({
    initialized: state.app.initialized,
    isAuth: state.auth.isAuth,
});

export const withAuthRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        constructor(props) {
            super(props);

        }

        componentDidMount() {
            this.props.initializeApp()
        }

        render(){
            if(!this.props.initialized) return <Preloader />;

            if (!this.props.isAuth) return <Login />;

            return <Component {...this.props}/>
        }
    }

    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect, {initializeApp})(RedirectComponent);

    return ConnectedAuthRedirectComponent
};
