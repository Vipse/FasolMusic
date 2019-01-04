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
                this.props.onSave(values.studentID);
            }
            else console.log("error", err);
        })
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return <Form onSubmit={this.handleSubmit}
                     className="AdminCreateTrainingModal">
            <div className="fields">
                <FormItem>
                    {getFieldDecorator('studentID', {
                        rules: [{
                            required: false,
                            message: 'Введите ID студента, пожалуйста'
                        }],
                    })(
                        <InputNew width="100%" bubbleplaceholder="ID студента"/>
                    )}
                </FormItem>
            </div>
            <div className="submitPlate">
                <Button className="saveBtn"
                        btnText='Создать абонемент'
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
