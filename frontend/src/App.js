import React, {Component} from 'react'
import "antd/dist/antd.css";
import css from './App.module.css'
import { Layout, Breadcrumb } from 'antd'
import {compose} from "redux";
import {connect, Provider} from "react-redux";
import store from "./redux/redux-store";
import {initializeApp} from "./redux/app-reducer";
import {
    BrowserRouter,
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import HeaderContainer from "./components/Header/HeaderContainer";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
// import Preloader from "./components/Common/Preloader/Preloader";
const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        const token = localStorage.getItem('token');
        this.state = {
            isAuth: this.props.isAuth,
            token: token,
        };
    }

    componentDidMount() {

        if (!this.state.isAuth){
            this.props.history.push('/login')
        } else {
            this.props.initializeApp(this.state.token);
        }

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.token !== prevProps.token){
            localStorage.setItem('token', this.props.token);
            this.props.history.push('/')
        }
    }
    render () {

        // if (!this.props.initialized)
        //     return <Preloader />;

        return (
            <Layout className="layout">
                <HeaderContainer />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={css.appWrapperContent}>

                        <Switch>
                            <Route path='/login' render={() => <Login />}/>
                        </Switch>

                    </div>
                </Content>
                <Footer />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    initialized: state.app.initialized,
    token: state.auth.token,
    isAuth: state.auth.isAuth,
});

let AppContainer = compose(
    connect(mapStateToProps, {initializeApp}),
    withRouter
)(App);


let MainApp = (props) => {
    return (
        <BrowserRouter>
            <Provider store={store} >
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
};

export default MainApp