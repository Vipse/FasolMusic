import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Hoc from '../Hoc'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import {Form} from "antd";
import SelectWithTT from "../SelectWithTT";
import InputWithTT from "../InputWithTT";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class Step3Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // if (!err) {
            //
            //     let fields = {
            //         ...values,
            //         avatarThumb: this.state.avatarThumb ? this.state.avatarThumb : this.props.data.avatarThumb
            //     };
            //     if(!values.avatar.url && !values.avatar.name) {
            //         fields.avatar = {name: this.state.avatarName, url: this.state.avatarUrl};
            //     }
            this.props.onSubmit(values);
            this.props.onNext();
            // }
        })
    };

    handleGoBack = () => {
        this.props.onPrev();
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-3">
                <div className="step-title">Идеальный тренер</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('coachGender', {
                            rules: [{
                                required: true,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Пол тренера"
                                className="step-form-item"
                                values={["Женский", "Мужской"]}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('coachAge', {
                            rules: [{
                                required: true,
                                message: 'Выберите возраст, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Возраст"
                                className="step-form-item"
                                values={["18-24", "25-35", "35-50", ">50"]}
                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('homework', {
                        rules: [{
                            required: true,
                            message: 'Выберите отношение к домашним заданиям, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            bubbleplaceholder="Дает домашние задания"
                            className="step-form-item"
                            values={["Да", "Нет"]}

                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('coachQual', {
                        rules: [{
                            required: true,
                            message: 'Выберите качества, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="1"
                            bubbleplaceholder="Качества"
                            className="step-form-item"
                            mode="multiple"
                            values={["С юмором", "Требовательный"]}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('comment', {
                        rules: [{
                            required: true,
                            message: 'Напишите комментарий, пожалуйста'
                        }],
                    })(
                        <TextArea
                            label="Комментарий"
                            placeholder=""
                            className="step-form-item"
                        />
                    )}
                </FormItem>

                <div className="steps-action">
                    <Button htmlType="submit"
                            btnText='Продолжить'
                            size='large'
                            type='pink'/>

                </div>
            </Form>
        )
    }
}

const Step3 = Form.create({
    mapPropsToFields(props) {
        let fields ={};
        for (let key in props.data){
            if (key !== 'current'){
                fields[key] = Form.createFormField({
                    value: props.data[key],
                })
            }
        }
        return fields;
    },
})(Step3Form);

Step3.propTypes = {
    data: PropTypes.object,
    onFinish: PropTypes.func,
};

Step3.defaultProps = {
    data: {},
    onFinish: () => {}
};

export default Step3
