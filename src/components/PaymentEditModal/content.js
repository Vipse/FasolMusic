import React from 'react';
import moment from 'moment'
import {Form, message} from 'antd';
import TextArea from '../TextArea'
import Button from '../Button'
import Radio from '../Radio'
import Upload from '../Upload'
import Icon from '../Icon'
import TimePicker from '../TimePicker'
import {previewFile} from "../../helpers/modifyFiles";
import Spinner from "../Spinner";
import InputNew from "../InputNew";
import DatePickerNew from "../DatePickerNew";
import InputWithTT from "../InputWithTT";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading:false
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        //const {visible, date, time} = this.props;

        return (
            <Form onSubmit={this.handleSubmit}
                  className="NewVisitModal">
                <div className="payment-fields">
                    <FormItem className="input-form-item">
                        {getFieldDecorator('number', {
                            initialValue: "1234 5678 1234 5678",
                            rules: [{ required: true,
                                message: 'Введите номер карты, пожалуйста'
                            }],
                        })(
                            <InputNew width ="100%" bubbleplaceholder="Номер карты"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('dateExpire', {
                            initialValue: "",
                            rules: [{ required: true,
                                message: 'Введите срок действия, пожалуйста'
                            }],
                        })(
                            <DatePickerNew width ="100%"
                                           bubbleplaceholder="Срок действия"
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('ownerName', {
                            initialValue: "",
                            rules: [{ required: true,
                                message: 'Введите имя держателя карты, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                width ="100%"
                                bubbleplaceholder="Имя держателя карты"
                                tooltip="Имя держателя карты Tooltip"
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('CVC', {
                            initialValue: "",
                            rules: [{ required: true,
                                message: 'Введите CVC-код, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                width ="100%"
                                bubbleplaceholder="CVC"
                                tooltip="CVC Tooltip"
                            />
                        )}
                    </FormItem>
                </div>
                <Button className="saveBtn"
                        btnText='Принять'
                        onClick={() => {}}
                        size='default'
                        type='light-pink'
                />
                {this.state.loading && <Spinner isInline={true} size="small" />}
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
