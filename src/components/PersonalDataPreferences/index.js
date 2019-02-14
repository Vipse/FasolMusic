import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'


import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import {getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class PersonalDataPreferences extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const { getFieldDecorator, isStudent, qualitiesList } = this.props;
        const { bestsex, bestage, bestishomework, bestqualities, bestcomment } = this.props.profile;
        const rootClass = cn('coach-data-block');
        const userTypeWord = isStudent ? 'студента' : 'тренера';

        return (
            <div className={rootClass}>
                <div className='coach-data-studentPreferences'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestsex', {
                            initialValue: bestsex === 'm' ? "Мужской" : bestsex === 'w' ? "Женский" : "Не важно",
                            rules: [{
                                required: false,
                                message: 'Выберите пол ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Пол"
                                       data={["Мужской", "Женский", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestage', {
                            initialValue: bestage,
                            rules: [{
                                required: false,
                                message: 'Выберите возраст ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Возраст"
                                       data={["18-24", "25-35", "36-50", ">50", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestishomework', {
                            initialValue: bestishomework === "1" ? "Да" : bestishomework === "0" ? "Нет" : "Не важно",
                            rules: [{
                                required: false,
                                message: 'Выберите отношение ' + userTypeWord + ' к выполнению домашнего задания, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder={(isStudent ? "Дает" : "Делает") + " домашнее задание"}
                                       data={["Да", "Нет", "Не важно"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestqualities', {
                            initialValue: getNamesFromObjArr(bestqualities),
                            rules: [{
                                required: false,
                                message: 'Выберите качества ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Качества"
                                       mode="multiple"
                                       data={qualitiesList}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestcomment', {
                            initialValue: bestcomment
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
        )
    }
}

PersonalDataPreferences.propTypes = {
    profile: PropTypes.object,
    isStudent: PropTypes.bool
};

PersonalDataPreferences.defaultProps = {
    profile: {},
    isStudent: false
};

export default PersonalDataPreferences
