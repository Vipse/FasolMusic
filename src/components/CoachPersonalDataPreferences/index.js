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

class CoachPersonalDataPreferencesForm extends React.Component{
    constructor() {
        super();
        this.state = {}
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { studentGender, studentAge, studentAcceptsHomework, studentQualities, studentComment} = this.props.profileCoach;
        const qualitiesArr = ["Спорт", "Кино и сериалы", "Туризм"];
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Идеальный студент</div>
                <div className='coach-data-block'>
                    <div className='coach-data-studentPreferences'>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('studentGender', {
                                initialValue: studentGender,
                                rules: [{ required: true,
                                    message: 'Выберите пол студента, пожалуйста'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Пол"
                                           data={["Мужской", "Женский"]}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('studentAge', {
                                initialValue: studentAge,
                                rules: [{ required: true,
                                    message: 'Выберите возраст студента, пожалуйста'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="Возраст"/>
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('studentAcceptsHomework', {
                                initialValue: studentAcceptsHomework,
                                rules: [{ required: true,
                                    message: 'Выберите отношение студента к д.з., пожалуйста'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Делает д.з."
                                           data={["Да", "Нет"]}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('studentQualities', {
                                initialValue: studentQualities,
                                rules: [{ required: true,
                                    message: 'Выберите качества студента, пожалуйста'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Качества"
                                           mode="multiple"
                                           data={qualitiesArr}
                                />
                            )}
                        </FormItem>
                        <FormItem className="input-form-item">
                            {getFieldDecorator('studentComment', {
                                initialValue: studentComment
                            })(
                                <TextArea
                                    label="Комментарий"
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

const CoachPersonalDataPreferences  = Form.create()(CoachPersonalDataPreferencesForm);

CoachPersonalDataPreferences.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataPreferences.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataPreferences
