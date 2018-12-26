import React from 'react';
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import { Form } from 'antd';
import { NavLink } from 'react-router-dom'
import Button from '../Button'
import Checkbox from '../Checkbox'
import Input from '../Input'


import './style.css'
import '../../icon/style.css'

const FormItem = Form.Item;

class LoginForm extends React.Component{

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    };

    render(){
        const {errorCode, urlForget, urlRegistrationStudent} = this.props;

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
                               addonAfter={<NavLink className="login-form-navlink"
                                                    to={urlForget}>Забыли пароль?</NavLink>}
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
                    <Button htmlType="submit"
                            btnText='Войти'
                            size='large'
                            type='yellow-black'/>
                    <div>У вас еще нет аккаунта? <br/>

                        <NavLink
                            to={urlRegistrationStudent}
                            className="login-form-navlink"
                        >
                            Зарегистрироваться
                        </NavLink>

                    </div>
                </div>
            </Form>
        )
    }
}

const Login = Form.create()(LoginForm);

Login.propTypes = {
    errorCode: PropTypes.oneOf([0,200, 400, 500]),
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
