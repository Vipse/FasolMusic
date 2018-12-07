import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'


import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class PersonalDataPreferences extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const {getFieldDecorator} = this.props;
        const isStudent = this.props.isStudent;
        const {bestsex, bestage, bestishomework, bestqualities, bestcomment} = this.props.profile;
        const qualitiesArr = ["Спорт", "Кино и сериалы", "Туризм"];
        const rootClass = cn('coach-data-form');
        const userTypeWord = isStudent ? 'студента' : 'тренера';

        return (
            <div className='coach-data-block'>
                <div className='coach-data-studentPreferences'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestsex', {
                            initialValue: bestsex === "m" ? "Мужской" : "Женский",
                            rules: [{
                                required: true,
                                message: 'Выберите пол ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Пол"
                                       data={["Мужской", "Женский"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestage', {
                            initialValue: bestage,
                            rules: [{
                                required: true,
                                message: 'Выберите возраст ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Возраст"
                                       data={["18-24", "25-35", "36-50", ">50"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestishomework', {
                            initialValue: bestishomework ? "Да" : "Нет",
                            rules: [{
                                required: true,
                                message: 'Выберите отношение ' + userTypeWord + ' к д.з., пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder={isStudent ? "Дает д.з." : "Делает д.з."}
                                       data={["Да", "Нет"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator('bestqualities', {
                            initialValue: bestqualities,
                            rules: [{
                                required: true,
                                message: 'Выберите качества ' + userTypeWord + ', пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Качества"
                                       mode="multiple"
                                       data={qualitiesArr}
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
