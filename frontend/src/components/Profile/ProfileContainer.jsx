import React from 'react'
import {compose} from "redux";
import {connect} from "react-redux";
import {withAuthRedirect} from "../../hoc/withAuthRedirect";


const ProfileContainer = (props) => {
        return (
            <div>
                Profile here
            </div>
        )
};

let mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
});

export default compose(
    connect(mapStateToProps, {}),
    withAuthRedirect
)(ProfileContainer);
