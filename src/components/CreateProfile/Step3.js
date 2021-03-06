import React from 'react';
import PropTypes from 'prop-types'
import Button from '../Button'
import {Form} from "antd";
import SelectWithTT from "../SelectWithTT";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class Step3Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
                this.props.onNext();
            }
            else
                console.log(err);
        });
    };

    handleGoBack = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.onSubmit(values);
            this.props.onPrev();
        });
    };

    render(){
        const { qualitiesList } = this.props;
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
                        {getFieldDecorator('bestsex', {
                            rules: [{
                                required: false,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Пол тренера"
                                className="step-form-item"
                                values={["Женский", "Мужской", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('bestage', {
                            rules: [{
                                required: false,
                                message: 'Выберите возраст, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Возраст"
                                className="step-form-item"
                                values={["18-24", "25-35", "36-50", ">50", "Не важно"]}
                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('bestishomework', {
                        rules: [{
                            required: false,
                            message: 'Выберите отношение к домашним заданиям, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            bubbleplaceholder="Дает домашние задания"
                            className="step-form-item"
                            values={["Да", "Нет", "Не важно"]}

                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('bestqualities', {
                        rules: [{
                            required: false,
                            message: 'Выберите качества, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="1"
                            bubbleplaceholder="Качества"
                            className="step-form-item"
                            mode="multiple"
                            values={qualitiesList}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('bestcomment', {
                        rules: [{
                            required: false,
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
                    <Button btnText='Назад'
                            size='large'
                            type='pink'
                            onClick={this.handleGoBack}/>
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
