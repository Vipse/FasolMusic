import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '../Button'
import {Form, message} from "antd";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import {getSelectedIDs, getSelectedNestedIDs} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class Step4Form extends React.Component{

    prepareDisciplines = (data) => {
        const {discipline, specialization, level, experience, goals, musicstyles, favoritesingers} = data;
        const {disciplineList, goalList, stylesList} = data.selectorsValues;
        return [{
            discipline: getSelectedIDs(disciplineList, discipline),
            specialization: getSelectedNestedIDs(disciplineList, specialization, [discipline]),
            level: level,
            experiense: experience,
            goals: getSelectedIDs(goalList, goals),
            musicstyles: getSelectedIDs(stylesList, musicstyles),
            favoritesingers: favoritesingers,
        }];
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const {name, datebirth, email, phones, sex, country, work, interests, avatar, facebookLink, googleLink,
                bestsex, bestage, bestishomework, bestqualities, bestcomment} = this.props.data;
            const {interestsList, qualitiesList, professionsList} = this.props.data.selectorsValues;
            if (!err) {
                const finalRegData = {
                    name,
                    datebirth: moment(datebirth).format('X'),
                    email,
                    phones,
                    sex: sex === "Мужской" ? "m" : sex === "Женский" ? "w" : null,
                    country,
                    work: getSelectedIDs(professionsList, work),
                    interests: getSelectedIDs(interestsList, interests),
                    avatar,
                    facebooklink: facebookLink,
                    googlelink: googleLink,

                    disciplines: this.prepareDisciplines(this.props.data),

                    bestsex: bestsex === "Мужской" ? "m" : bestsex === "Женский" ? "w" : null,
                    bestage,
                    bestishomework: bestishomework === "Да" ? 1 : bestishomework === "Нет" ? 0 : null,
                    bestqualities: getSelectedIDs(qualitiesList, bestqualities),
                    bestcomment,

                    amountdays: values.amountdays,

                    password: "123456"
                };

                console.log("FINAL REG DATA", finalRegData);

                this.props.onFinish(finalRegData).then(res => {
                    if (res && res.data && !res.data.error)
                        this.props.onNext();
                    else if (res && res.data) {console.log(res.data.error);
                        message.error('Ошибка ' + res.data.error.code + ': ' + res.data.error.text, 10);
                        //message.error('Заполнены не все обязательные поля', 4);
                    }
                });
            }
            else
                console.log(err);
        });
    };

    handleGoBack = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const fields = {
                amountdays: values.amountdays
            };

            this.props.onSubmit(fields);
            this.props.onPrev();
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-4">
                <div className="step-title">Удобное время занятий</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        <div className='radio-label radio-label-amountdays'>Количество дней в неделю:</div>
                            {getFieldDecorator('amountdays', {
                                rules: [{ required: true,
                                    message: 'Выберите количество дней, пожалуйста' }],
                            })(
                                <RadioGroup className="ant-radio-group" style={{display: "flex", flexDirection: "column"}}>
                                    <Radio value='1' key='radio-1'>1</Radio>
                                    <Radio value='2' key='radio-2'>2</Radio>
                                    <Radio value='3' key='radio-3'>3</Radio>
                                    <Radio value='4' key='radio-4'>4</Radio>
                                    <Radio value='5' key='radio-5'>5</Radio>
                                    <Radio value='5+' key='radio-5+'>5 и более</Radio>
                                </RadioGroup>
                            )}
                    </FormItem>
                </div>

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

const Step4 = Form.create({
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
})(Step4Form);

Step4.propTypes = {
    data: PropTypes.object,
    onFinish: PropTypes.func,
};

Step4.defaultProps = {
    data: {},
    onFinish: () => {}
};

export default Step4
