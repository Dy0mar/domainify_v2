import React, {Component} from 'react'
import "antd/dist/antd.css";
import './App.css'
import { Layout, Breadcrumb } from 'antd'
import {compose} from "redux";
import {connect, Provider} from "react-redux";
import store from "./redux/redux-store";
import {initializeApp} from "./redux/app-reducer";
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
    withRouter
} from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Preloader from "./components/Common/Preloader/Preloader";
const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: this.props.isAuth,
            logged_in: !!localStorage.getItem('token')
        };
    }

    componentDidMount() {
        if (!this.state.logged_in){
            this.props.history.push('/login')
        }
        // нужно проверить - мы аутент ?
        // если токена нет или не verify, то редирект на логин

        /*if (!this.state.logged_in && this.props.token){
            localStorage.setItem('token', this.props.token);
            this.state.logged_in = true
        }

        const token = localStorage.getItem('token')
            ? localStorage.getItem('token')
            : this.props.token;

        this.props.initializeApp(token);*/

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.token && prevProps.isAuth !== this.props.isAuth){
            localStorage.setItem('token', this.props.token);
            this.props.history.push('/')
        }
    }
    render () {

        /*if (!this.props.initialized)
            return <Preloader />;*/

        return (
            <Layout className="layout">
                <Header />
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="app-wrapper-content">

                        {!this.props.initialized && <Preloader />}

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