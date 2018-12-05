import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {Form, message} from "antd";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class PersonalSuggestionsForm extends React.Component{

    constructor() {
        super();
        this.state = {
            uploadingSuggestion: false
        };
    }

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
                        if (!res.data.error) {
                            message.success("Предложение отправлено");
                            this.props.form.resetFields();
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
        const rootClass = cn('personal-suggestions');
        return (
            <Form className={rootClass}>
                <Card title="Предложения по улучшению">
                    <div className='suggestions-column'>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                            eligendi harum hic neque porro recusandae
                        </p>
                        <div className='suggestions-column-input'>
                            <FormItem className="input-form-item">
                                {getFieldDecorator('improvetext', {
                                    rules: [{
                                        required: true,
                                        message: 'Введите комментарий, пожалуйста'
                                    }],
                                })(
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
                </Card>
            </Form>
        )
    }
}

const PersonalSuggestions  = Form.create()(PersonalSuggestionsForm);

PersonalSuggestions.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalSuggestions.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default PersonalSuggestions
