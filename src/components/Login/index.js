import React from 'react';
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Form } from 'antd';
import { NavLink } from 'react-router-dom'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Input from '../Input'
import {message} from "antd";


import './style.css'
import '../../icon/style.css'
import { instanceOf } from 'prop-types';
import SocialAuth from "../SocialAuth";

const FormItem = Form.Item;

class LoginForm extends React.Component{
    state = {
        showSocialLogin: false
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    };

    handleSocialAuth = (name, valuesObj) => {
        if (valuesObj && valuesObj.link)
            return this.props.onSocialAuthorization(valuesObj.link);
        else {
            message.error('Ошибка при авторизации через ' + name);
            return new Promise(resolve => resolve({data: {}}));
        }
    };

    render(){
        const {errorCode, urlForget, urlRegistrationStudent, urlTrialTraining} = this.props;
        const {showSocialLogin} = this.state;

        const { getFieldDecorator } = this.props.form;

        let error = [];

        switch(errorCode){
            case 400:
                error = [{
                    validateStatus: 'error',
                    help: "Неверное имя или пароль",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 500:
                error = [{
                    validateStatus: 'error',
                    help: "Такого пользователя не существует",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 404:
                error = [{
                    validateStatus: 'error',
                    help: "Такого пользователя не существует",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 405:
                error = [{
                    validateStatus: 'error',
                    help: "Неверно имя или пароль",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 200:
            default:
                error = [];
        }

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <div className="login-title">Авторизация</div>
                <div className="login-notification">* Поля, обязательные для заполнения</div>
                <FormItem {...error[0]}>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Введите ваш логин или e-mail, пожалуйста' }],
                    })(
                        <Input placeholder='* E-mail или логин'
                               className='login-form-item'/>
                    )}
                </FormItem>
                <FormItem {...error[1]}>
                    {getFieldDecorator('password', {
                        rules: [{ required: false, message: 'Введите ваш пароль, пожалуйста' }],
                    })(
                        <Input placeholder='* Пароль'
                               type="password"
                               className='login-form-item'/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>Запомнить меня</Checkbox>
                    )}
                </FormItem>
                <div className="login-form-control">
                    <div className="login-form-control-btns">
                        <Button htmlType="submit"
                                btnText='Войти'
                                size='large'
                                type='yellow-black'/>
                        {!showSocialLogin && <div
                            onClick={() => this.setState({showSocialLogin: true})}
                            className="login-form-control-btns-social"
                        >
                            Войти через привязанную социалку
                        </div>}
                        {showSocialLogin && <SocialAuth
                            onChange={this.handleSocialAuth}
                            isLogin={true}
                        />}
                    </div>
                    <div>У вас еще нет аккаунта? <br/>

                        <NavLink
                            to={urlRegistrationStudent}
                            className="login-form-navlink"
                        >
                            Зарегистрироваться
                        </NavLink><br/>
                    </div>
                </div>
            </Form>
        )
    }
}

const Login = Form.create()(LoginForm);

Login.propTypes = {
    errorCode: PropTypes.oneOf([0,200, 400, 404, 500]),
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    onSubmit: PropTypes.func,
};

Login.defaultProps = {
    errorCode: 0,
    urlForget: '',
    urlRegistration: '',
    onSubmit: () => {},
};

export default Login
