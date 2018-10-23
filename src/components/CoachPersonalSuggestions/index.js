import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import CoachPersonalContactItem from '../CoachPersonalContactItem'
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

class CoachPersonalSuggestionsForm extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    handleSubmitSuggestion = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //this.setState({loadingSuggestion:true});

                console.log("suggestion", values);
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
                                {getFieldDecorator('comment', {
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
                            type='float'
                            style={{marginRight: "20px"}}
                        />
                        {this.state.loadingSuggestion && <Spinner isInline={true} size="small"/>}
                    </div>
                </Card>
            </Form>
        )
    }
}

const CoachPersonalSuggestions  = Form.create()(CoachPersonalSuggestionsForm);

CoachPersonalSuggestions.propTypes = {
    profileDoctor: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalSuggestions.defaultProps = {
    profileDoctor: {},
    onSubmit: () => {}
};

export default CoachPersonalSuggestions
