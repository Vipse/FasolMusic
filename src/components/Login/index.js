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
import moment from "../CreateProfile/Step1";
import {getSelectedIDs} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class LoginForm extends React.Component{
    state = {
        showSocialLogin: false,
        activePage: 'signup',
        avatar: '',
        facebookLink: '',
        googleLink: '',
        name: ''
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {history} = this.props;
        const {activePage, name, avatar, facebookLink, googleLink} = this.state;
        const isRegister = activePage === 'signup';

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (isRegister) {
                    const finalRegData = {
                        name: name ? name : values.email,
                        email: values.email,
                        phones: values.phone,
                        avatar,
                        facebooklink: facebookLink,
                        googlelink: googleLink,
                        password: "1234"
                    };
                    this.props.onSubmitRegistration(finalRegData)
                        .then(res => {
                            if (res && res.data && !res.data.error)
                                history.push("/app");
                        })
                        .catch(err => console.log(err));
                }
                else {
                    const finalLoginData = {
                        userName: values.email,
                        password: values.password
                    };
                    this.props.onSubmitLogin(finalLoginData);
                }
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

    handleSocialRegistration = (name, valuesObj) => {
        const {getFieldValue, setFieldsValue} = this.props.form;

        if (valuesObj.link) {
            return this.props.onSocialNetworkCheck(valuesObj.link, name)
                .then((res) => {
                    if (res && res.data && !res.data.error) {
                        this.setState({[name + 'Link']: valuesObj.link});

                        const checkableFields = ['email'];
                        checkableFields.forEach(item => {
                            if (!getFieldValue(item) && valuesObj[item])
                                setFieldsValue({[item]: valuesObj[item]});
                        });

                        if (valuesObj.name)
                            this.setState({name: valuesObj.name});
                        if (valuesObj.avatar)
                            this.setState({avatar: valuesObj.avatar});
                    }

                    return res;
                })
                .catch(err => console.log(err));
        }
        else {
            this.setState({[name + 'Link']: valuesObj.link});
            return new Promise(resolve => resolve({data: {}}));
        }
    };

    changeTab = (name) => {
        this.setState({activePage: name});
        this.props.resetError();
    };

    render(){
        const {errorCode, urlForget, urlRegistrationStudent, urlTrialTraining} = this.props;
        const {activePage, facebookLink, googleLink} = this.state;

        const { getFieldDecorator } = this.props.form;

        let error = [];

        switch(errorCode){
            case 400:
                error = [{
                    validateStatus: 'error',
                    help: "Такой пользователь уже существует",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 401:
                error = [{
                    validateStatus: 'error',
                    help: "Невозможно создать пользователя",
                },{
                    validateStatus: 'error',
                }];
                break;
            case 402:
                error = [{
                    validateStatus: 'error',
                    help: "Не все необходимые поля заполнены",
                }, {
                    validateStatus: 'error',
                    help: "Не все необходимые поля заполнены",
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
                error = [{}, {
                    validateStatus: 'error',
                    help: "Неверный пароль",
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
                <div className="login-title">
                    <span className={activePage === 'signin' ? 'active' : null}
                          onClick={() => this.changeTab('signin')}>Авторизация</span>
                    <span className='delimiter'>/</span>
                    <span className={activePage === 'signup' ? 'active' : null}
                          onClick={() => this.changeTab('signup')}>Регистрация</span>
                </div>
                <div className='login-body'>
                    {activePage === 'signup' ?
                    <div className='login-body-text'>
                        <p className='login-body-text-title'>
                            Зарегистрируйтесь и пройдите бесплатную пробную тренировку по вокалу или по гитаре один на один с коучем в режиме онлайн. 💻
                        </p>
                        <p className='login-body-text-body'>
                            Самостоятельно выбирайте удобное время и понравившегося вам коуча. 📆👆
                            Не теряйте время на дорогу! ⏰
                            Fasol музыкальная качалка идет в ногу со временем,
                            делая обучение мобильным, не привязанным к определенной локации.
                            Даем каждому возможность освоить новое хобби и приобрести новых друзей! 🌍💪
                        </p>
                    </div> : null}
                    <div className='login-body-fields'>
                        <FormItem {...error[0]}>
                            {getFieldDecorator('email', {
                                rules: [{required: true, message: 'Введите ваш Email, пожалуйста'}],
                            })(
                                <Input placeholder='E-mail*'
                                       onChange={this.props.resetError}
                                       className='login-form-item'/>
                            )}
                        </FormItem>
                        {activePage === 'signin' ?
                            <FormItem {...error[1]}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: 'Введите ваш пароль, пожалуйста'}],
                                })(
                                    <Input placeholder='Пароль*'
                                           type="password"
                                           onChange={this.props.resetError}
                                           className='login-form-item'/>
                                )}
                            </FormItem> :
                            <FormItem>
                                {getFieldDecorator('phone', {
                                    rules: [{required: false, message: 'Введите ваш телефон, пожалуйста'}],
                                })(
                                    <Input placeholder='Телефон'
                                           onChange={this.props.resetError}
                                           className='login-form-item'/>
                                )}
                            </FormItem>
                        }
                    </div>
                    {/*activePage === 'signin' &&
                    <div className='login-body-checkbox'>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(
                                <Checkbox>Запомнить меня</Checkbox>
                            )}
                        </FormItem>
                    </div>
                    */}

                    <div className='login-body-controls'>
                        <Button
                            className='login-body-controls-btn'
                            htmlType="submit"
                            btnText={activePage === 'signin' ? 'Авторизоваться' : 'Регистрация'}
                            size='large'
                            type='bright-blue'
                        />
                    </div>
                    <div className="login-body-socialPlate">
                        <SocialAuth
                            facebookLink={activePage === 'signup' ? facebookLink : ''}
                            googleLink={activePage === 'signup' ? googleLink : ''}
                            onChange={activePage === 'signin' ? this.handleSocialAuth : this.handleSocialRegistration}
                            isLogin={activePage === 'signin'}
                        />
                    </div>
                </div>
            </Form>
        )
    }
}

const Login = Form.create()(LoginForm);

Login.propTypes = {
    errorCode: PropTypes.oneOf([0,200, 400, 401, 402, 404, 405]),
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
