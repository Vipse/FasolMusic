import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'

import './style.css'
import '../../icon/style.css'
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import DatePickerNew from "../DatePickerNew";
import moment from "moment";

const FormItem = Form.Item;

class PersonalDataInfo extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const {getFieldDecorator} = this.props;
        const isStudent = this.props.isStudent;
        const {sex, datebirth, speciality, interests, aboutme} = this.props.profile;
        const specialityArr = ["Программист"];
        const interestsArr = ["Спорт", "Кино и сериалы", "Туризм"];
        const rootClass = cn('coach-data-form');

        return (
            <div className='coach-data-block'>
                <div className='coach-data-additionalInfo'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('gender', {
                            initialValue: sex === "m" ? "Мужской" : "Женский",
                            rules: [{
                                required: true,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Пол"
                                       data={["Мужской", "Женский"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('birthday', {
                            initialValue: datebirth ? moment(datebirth, "x") : null,
                            rules: [{
                                required: true,
                                message: 'Выберите дату рождения, пожалуйста'
                            }],
                        })(
                            <DatePickerNew width="100%"
                                           bubbleplaceholder="Дата рождения"
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('speciality', {
                            //initialValue: specialityArr[0],
                            rules: [{
                                required: true,
                                message: 'Выберите сферу деятельности, пожалуйста'
                            }],
                        })(
                            <SelectNew className=""
                                       width="100%"
                                       bubbleplaceholder="Сфера деятельности"
                                       data={specialityArr}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('interests', {
                            //initialValue: interests,
                            rules: [{
                                required: true,
                                message: 'Выберите интересы, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Интересы"
                                       mode="multiple"
                                       data={interestsArr}
                            />
                        )}
                    </FormItem>
                    {!isStudent && <FormItem className="input-form-item">
                        {getFieldDecorator('aboutMe', {
                            initialValue: aboutme,
                            rules: [{
                                required: true,
                                message: 'Напишите о себе, пожалуйста'
                            }]
                        })(
                            <TextArea
                                label="О себе"
                                placeholder=""
                                className="step-form-item"
                            />
                        )}
                    </FormItem>}
                </div>
            </div>
        )
    }
}

PersonalDataInfo.propTypes = {
    profile: PropTypes.object,
    isStudent: PropTypes.bool
};

PersonalDataInfo.defaultProps = {
    profile: {},
    isStudent: false
};

export default PersonalDataInfo
