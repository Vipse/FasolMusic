import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'
import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'


import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import DatePickerNew from "../DatePickerNew";

const FormItem = Form.Item;

class CoachPersonalDataInfoForm extends React.Component{
    constructor() {
        super();
        this.state  = {}
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { gender, birthday, speciality, interests, aboutMe} = this.props.profileCoach;
        const specialityArr = ["Программист"];
        const interestsArr = ["Спорт", "Кино и сериалы", "Туризм"];
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Дополнительная информация</div>
                <div className='coach-data-block'>
                    <div className='coach-data-additionalInfo'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('gender', {
                                initialValue: gender,
                                rules: [{ required: true,
                                    message: 'Выберите пол, пожалуйста'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Пол"
                                           data={["Мужской", "Женский"]}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('birthday', {
                                initialValue: birthday,
                                rules: [{ required: true,
                                    message: 'Выберите дату рождения, пожалуйста'
                                }],
                            })(
                                <DatePickerNew width ="100%"
                                           bubbleplaceholder="Дата рождения"
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('speciality', {
                                initialValue: speciality,
                                rules: [{ required: true,
                                    message: 'Выберите сферу деятельности, пожалуйста'
                                }],
                            })(
                                <SelectNew className=""
                                           width ="100%"
                                           bubbleplaceholder="Сфера деятельности"
                                           data={specialityArr}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('interests', {
                                initialValue: interests,
                                rules: [{ required: true,
                                    message: 'Выберите интересы, пожалуйста'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Интересы"
                                           mode="multiple"
                                           data={interestsArr}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('aboutMe', {
                                initialValue: aboutMe,
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
                        </FormItem>
                    </div>
                </div>

            </Form>
        )
    }
}

const CoachPersonalDataInfo  = Form.create()(CoachPersonalDataInfoForm);

CoachPersonalDataInfo.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataInfo.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataInfo
