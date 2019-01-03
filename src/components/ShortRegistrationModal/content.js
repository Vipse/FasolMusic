import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'
import Spinner from "../Spinner";
import InputNew from "../InputNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //this.setState({loading: true});
                let finalData = {
                    ...values
                };
                this.props.onSave(finalData);
            }
            else console.log("error", err);
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return <Form onSubmit={this.acceptPromo}
                     className="ShortRegistrationModal">
            <div className="code">
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{
                            required: false,
                            message: 'Введите e-mail, пожалуйста'
                        },
                            {
                                type: "email",
                                message: 'Неправильный формат'
                            }],
                    })(
                        <InputNew width="100%" bubbleplaceholder="E-mail"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('phones', {
                        rules: [{
                            required: false,
                            message: 'Введите телефон, пожалуйста'
                        }],
                    })(
                        <InputNew width="100%" bubbleplaceholder="Телефон"/>
                    )}
                </FormItem>
            </div>
            <div className="submitPlate">
                <Button className="saveBtn"
                        btnText='Зарегистрироваться'
                        onClick={() => {
                        }}
                        size='large'
                        type='light-pink'
                />
                {this.state.loading && <Spinner/>}
            </div>
        </Form>;
    }
}

const Content = Form.create()(ContentForm);

export default Content
