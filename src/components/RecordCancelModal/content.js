import React from 'react';
import moment from 'moment'
import {Form, message} from 'antd';
import TimePicker from '../TimePicker'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Spinner from "../Spinner";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        confirmed: false
    };

    componentWillMount() {
        this.setState({
            confirmed: false
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onSave(...values);
            }
            else console.log("error", err);
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        if (!this.state.confirmed) return (
          <div className="TransferRecordModal">
              <p className="attention">Вы уверены, что хотите отменить эту тренировку?</p>
              <div className="TransferRecordModal-confirm">
                  <Button className="saveBtn"
                          btnText='Да'
                          onClick={() => {this.setState({confirmed: true})}}
                          size='small'
                          type='black'
                  />
                  <Button className="saveBtn"
                          btnText='Назад'
                          onClick={this.props.onCancel}
                          size='small'
                          type='light-pink'
                  />
              </div>
          </div>
        );
        else return (
            <Form onSubmit={this.handleSubmit}
                  className="TransferRecordModal">
                <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <FormItem>
                    {getFieldDecorator('reason', {
                        rules: [{
                            required: true,
                            message: 'Введите причину, пожалуйста'
                        }],
                    })(
                        <TextArea
                            placeholder="Укажите причину отмены"
                            className="step-form-item"
                        />
                    )}
                </FormItem>
                <div className="submitPlate">
                    <Button className="saveBtn"
                            btnText='Сохранить'
                            onClick={() => {}}
                            size='default'
                            type='yellow-black'
                    />
                    {this.state.loading && <Spinner/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
