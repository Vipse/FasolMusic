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
import {getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class PersonalDataInfo extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const { getFieldDecorator, isStudent, interestsList, professionsList } = this.props;
        const { sex, datebirth, work, interests, aboutme } = this.props.profile;
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass}>
                <div className='coach-data-additionalInfo'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('sex', {
                            initialValue: sex === 'm' ? "Мужской" : sex === 'w' ? "Женский" : "Не важно",
                            rules: [{
                                required: false,
                                message: 'Выберите пол, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Пол"
                                       data={["Мужской", "Женский", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('datebirth', {
                            initialValue: datebirth ? moment(datebirth * 1000, "x") : null,
                            rules: [{
                                required: true,
                                message: 'Выберите дату рождения, пожалуйста'
                            }],
                        })(
                            <DatePickerNew width="100%"
                                           bubbleplaceholder="*Дата рождения"
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('work', {
                            initialValue: getNamesFromObjArr(work),
                            rules: [{
                                required: true,
                                message: 'Выберите сферу деятельности, пожалуйста'
                            }],
                        })(
                            <SelectNew className=""
                                       width="100%"
                                       bubbleplaceholder="*Сфера деятельности"
                                       data={professionsList}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('interests', {
                            initialValue: getNamesFromObjArr(interests),
                            rules: [{
                                required: true,
                                message: 'Выберите интересы, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="*Интересы"
                                       mode="multiple"
                                       data={interestsList}
                            />
                        )}
                    </FormItem>
                    {!isStudent && <FormItem className="input-form-item">
                        {getFieldDecorator('aboutme', {
                            initialValue: aboutme,
                            rules: [{
                                required: false,
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
