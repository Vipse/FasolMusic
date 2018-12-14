import React from 'react';
import PropTypes from 'prop-types'
import { Form } from 'antd';
import Button from '../Button'
import InputWithTT from "../InputWithTT";
import SelectWithTT from "../SelectWithTT";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class Step2Form extends React.Component{
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
            } else
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

    resetSpecialization = () => {
        this.props.form.resetFields(['specialization']);
    };

    render(){
        const { form, disciplineList, specializationList, goalList, stylesList } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-2">
                <div className="step-title">Уровень подготовки</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('discipline', {
                            rules: [{
                                required: true,
                                message: 'Выберите дисциплину, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="*Дисциплина"
                                className="step-form-item"
                                values={disciplineList}
                                onChange={this.resetSpecialization}
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('specialization', {
                            rules: [{
                                required: false,
                                message: 'Выберите специализацию, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Специализация"
                                className="step-form-item"
                                values={specializationList[form.getFieldValue('discipline')]}
                            />
                        )}
                    </FormItem>
                </div>
                <div className="step-form-row">
                    <FormItem>
                        {getFieldDecorator('level', {
                            rules: [{
                                required: false,
                                message: 'Введите ваш уровень подготовки, пожалуйста'
                            }],
                        })(
                            <InputWithTT
                                key="level"
                                bubbleplaceholder="Уровень подготовки"
                                className="step-form-item"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('experience', {
                            rules: [{
                                required: false,
                                message: 'Выберите опыт занятия музыкой, пожалуйста'
                            }],
                        })(
                            <SelectWithTT
                                bubbleplaceholder="Опыт занятия музыкой"
                                className="step-form-item"
                                values={["1 год", "2 года", "3 года", "4 года", "5 лет"]}
                            />
                        )}
                    </FormItem>
                </div>
                <FormItem>
                    {getFieldDecorator('goals', {
                        rules: [{
                            required: false,
                            message: 'Выберите цели, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            key="1"
                            bubbleplaceholder="Цели"
                            className="step-form-item"
                            mode="multiple"
                            values={goalList}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('musicstyles', {
                        rules: [{
                            required: false,
                            message: 'Выберите стиль музыки, который вам нравится, пожалуйста'
                        }],
                    })(
                        <SelectWithTT
                            bubbleplaceholder="Стиль музыки, который мне нравится"
                            className="step-form-item"
                            values={stylesList}

                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('favoritesingers', {
                        rules: [{
                            required: false,
                            message: 'Укажите любимых исполнителей, пожалуйста'
                        }],
                    })(
                        <TextArea
                            label="Любимые исполнители"
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

const Step2 = Form.create({
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
})(Step2Form);

Step2.propTypes = {
    urlForget: PropTypes.string,
    urlRegistration: PropTypes.string,
    academicDegree: PropTypes.array,
    academicTitle: PropTypes.array,
    langs: PropTypes.array,
    payments: PropTypes.array,
    onSubmit: PropTypes.func,
    onNext: PropTypes.func,
    onPrev: PropTypes.func
};

Step2.defaultProps = {
    urlForget: '',
    urlRegistration: '',
    academicDegree: [],
    academicTitle: [],
    langs: [],
    payments: [],
    onSubmit: () => {},
    onNext: () => {},
    onPrev: () => {}
};

export default Step2
