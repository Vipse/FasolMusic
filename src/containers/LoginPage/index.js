import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux';
import {NavLink, Route} from 'react-router-dom'
import Hoc from '../../hoc'
import Icon from "../../components/Icon/index.js";
import Row from "../../components/Row/index.js";
import Col from "../../components/Col/index.js";
import Login from "../../components/Login/index.js";
import { message } from 'antd';
import LoginForget from "../../components/LoginForget/index.js";
import Registration from "../../components/Registration/index.js";
import CreateProfile from "../../components/CreateProfile";

import RegistrationPatient from "../../components/RegistrationPatient/index.js";
import langsArray from "../../helpers/langsArray"
import addInfoObj from "../../helpers/addInfoObj"


import * as actions from '../../store/actions'
import './styles.css'
import ReportBugModal from "../../components/ReportBugModal";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegFinished: false
        };
    }

    render(){
        const langs = langsArray;
        const payments = addInfoObj.payments;
        const academicTitle = addInfoObj.title ;
        const academicDegree = addInfoObj.degree ;
        const category = addInfoObj.category;

        return (
            <Hoc>

                <div className="loginPage-header">
                    <div className="loginPage-header-close">
                        <NavLink to="/login" onClick={this.onOk}>
                            <Icon type='close' svg />
                        </NavLink>

                    </div>
                </div>

                <Row style={{marginLeft: 0, marginRight: 0}}>
                    <Col xs={{span: 12, offset: 6}}
                         sm={{span: 12, offset: 6}}
                         md={{span: 12, offset: 6}}
                         lg={{span: 12, offset: 6}}
                         xl={{span: 12, offset: 6}}>
                        <Route path="/login"
                               exact
                               render={() => <Login urlForget={this.props.match.url + '/forget'}
                                                    urlRegistrationStudent='/registration'
                                                    errorCode={this.props.errorCode}
                                                    onSubmit={(obj) => this.props.onLogin(obj, this.props.history)}
                               />}
                        />
                        <Route path="/login/forget"
                               exact
                               render={() => <LoginForget urlLogin={this.props.match.url}
                                                          onUrlChange={() => {
                                                              this.props.history.replace(this.props.match.url)
                                                          }}/>}
                        />
                        <Route path="/registration"
                               exact
                               render={() => <CreateProfile onSubmit={this.props.onRegisterUser}
                                                            urlLogin="/login"
                                                            //langs={langs}
                                                            //checkEmailAvailability={this.props.onCheckEmailAvailability}
                                                            //uploadFile = {this.props.uploadFile}
                               />}
                        />
                    </Col>
                </Row>
            </Hoc>
        )
    }


}

const mapStateToProps = state => {
	return {
        errorCode: state.auth.errorCode,
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onLogin: ({userName, password, remember}, history) => dispatch(actions.login(userName, password, remember, history)),
        onRegisterUser: (userInfo) => dispatch(actions.registerUser(userInfo)),
        onCheckEmailAvailability: (email) => dispatch(actions.checkEmailAvailability(email)),
        reportBug: (message, href) => dispatch(actions.reportBug(message, href)),
        uploadFile: (file) => dispatch(actions.uploadFile(file))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
