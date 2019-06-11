import React from 'react';
import PropTypes from 'prop-types'

import { withRouter } from 'react-router-dom'
import { Form } from 'antd';
import { NavLink } from 'react-router-dom'
import Button from '../Button'
import Input from '../Input'


import './style.css'
import '../../icon/style.css'

import {message} from 'antd';

const FormItem = Form.Item;

class LoginForgetForm extends React.Component{

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
                this.props.onForgetEmail(values.email)
                .then((res)=>{
                    if(res.data.error !== undefined) {message.success("Такого аккаунта не существует");}
                    else {
                    message.success("Письмо для восстановления отправлено");
                    this.props.history.push('/signin');
                    }
                })
            }
        });
    };

    goBackHandler = (e) => {
        e.preventDefault();
        this.props.onUrlChange()
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        const link = this.props.onUrlChange ?
            (<span onClick={this.goBackHandler}
                   className="loginforget-backlink">Авторизации</span>)
            :
            (<NavLink to={this.props.urlLogin}
                      className="login-form-navlink">Авторизации</NavLink>);

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <div className="login-title">Забыли пароль?</div>
                <div className="loginforget-body">
                    Нет проблем. Мы отправим вам инструкцию по сбросу пароля.
                    <FormItem>
                        {getFieldDecorator('email')(
                            <Input placeholder="Введите почту"/>
                        )}
                    </FormItem>
                </div>
                <div className="loginforget-control">
                    <Button htmlType="submit"
                            btnText='Отправить'
                            size='large'
                            type='gradient'/>
                    <div>Вернуться на страницу {link}</div>
                </div>
            </Form>
        )
    }
}

const LoginForget = Form.create()(LoginForgetForm);

LoginForget.propTypes = {
    text: PropTypes.string,
    urlLogin: PropTypes.string,
    onUrlChange: PropTypes.func,
    onSubmit: PropTypes.func,
};

LoginForget.defaultProps = {
    text: '',
    urlLogin: '',
    onUrlChange: null,
    onSubmit: () => {},
};

export default withRouter(LoginForget)


