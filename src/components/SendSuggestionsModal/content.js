import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'
import Spinner from "../Spinner";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        uploadingSuggestion: false
    };

    handleSubmitSuggestion = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({uploadingSuggestion: true});

                const dataObj = {
                    id: this.props.profile.id,
                    improvetext: values.improvetext
                };

                this.props.onSubmit(dataObj)
                    .then((res) => {
                        this.setState({uploadingSuggestion: false});
                        if (res && !res.data.error) {
                            message.success("Предложение отправлено");
                            this.props.form.resetFields();
                            this.props.onCancel();
                        } else
                            message.error("Произошла ошибка, попробуйте ещё раз");
                    })
            } else {
                console.log(err);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmitSuggestion} className="SendSuggestionsModal">
                <div className='suggestions-column'>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                        eligendi harum hic neque porro recusandae
                    </p>
                    <div className='suggestions-column-input'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('improvetext')(
                                <TextArea
                                    label="Комментарий"
                                    placeholder=""
                                    className="step-form-item"
                                />
                            )}
                        </FormItem>
                    </div>

                    <Button
                        btnText='Отправить'
                        onClick={this.handleSubmitSuggestion}
                        size='default'
                        type='light-blue'
                        disable={this.state.uploadingSuggestion}
                        style={{marginRight: "20px"}}
                    />
                    {this.state.uploadingSuggestion && <Spinner isInline={true} size="small"/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
