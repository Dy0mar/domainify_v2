import React from 'react';
import 'antd/dist/antd.css';
import { message } from 'antd';
import {connect} from "react-redux";
import {showedMessage} from "../redux/app-reducer";
import {getLastMessage} from "../selectors/users-selectors";

const mapStateToProps = (state) => ({
    lastMessage: getLastMessage(state)
});

export const showMessage = (Component) => {
    class showMessageComponent extends React.Component {
        show = () => {
            const messObj = this.props.lastMessage;
            if (messObj && messObj.id > 0){
                message[messObj.type](messObj.message);
                this.props.showedMessage(messObj)
            }
        };
        componentDidMount() {
            this.show()
        }
        componentDidUpdate(prevProps, prevState, snapshot) {
            this.show()
        }

        render(){
            return <Component {...this.props}/>
        }
    }

    const ConnectedShowMessageComponent = connect(mapStateToProps,{showedMessage})(showMessageComponent);

    return ConnectedShowMessageComponent
};
          