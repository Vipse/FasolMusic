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

class PersonalDataSkill extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const {getFieldDecorator, number} = this.props;
        const {disciplines, specialization, skill, experience, aims, musicStyles, favouriteArtists} = this.props.profile;
        const rootClass = cn('coach-data-form');

        return (
            <div className='coach-data-block'>
                <div className='coach-data-skill'>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-subject', {
                            initialValue: disciplines,
                            rules: [{
                                required: true,
                                message: 'Выберите дисциплину, пожалуйста'
                            }],
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Дисциплина"
                                       data={["Гитара", "Вокал"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-specialization', {
                            initialValue: specialization,
                            rules: [{
                                required: true,
                                message: 'Введите специализацию, пожалуйста'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="Специализация"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-skill', {
                            initialValue: skill,
                            rules: [{
                                required: true,
                                message: 'Введите уровень подготовки, пожалуйста'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="Уровень подготовки"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-experience', {
                            initialValue: experience,
                            rules: [{
                                required: true,
                                message: 'Введите опыт занятия, пожалуйста'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="Опыт занятия"/>
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-aims', {
                            initialValue: aims,
                            rules: [{
                                required: true,
                                message: 'Выберите цели, пожалуйста'
                            }]
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Цели"
                                       mode="multiple"
                                       data={["Спорт", "Кино и сериалы", "Туризм"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-musicStyles', {
                            initialValue: musicStyles,
                            rules: [{
                                required: true,
                                message: 'Выберите предпочитаемые стили музыки, пожалуйста'
                            }]
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Предпочитаемые стили музыки"
                                       mode="multiple"
                                       data={["Спорт", "Кино и сериалы", "Туризм"]}
                            />
                        )}
                    </FormItem>
                    <FormItem className="input-form-item">
                        {getFieldDecorator(number + '-favouriteArtists', {
                            initialValue: favouriteArtists,
                            rules: [{
                                required: true,
                                message: 'Выберите любимых исполнителей, пожалуйста'
                            }]
                        })(
                            <SelectNew width="100%"
                                       bubbleplaceholder="Любимые исполнители"
                                       mode="multiple"
                                       data={["Спорт", "Кино и сериалы", "Туризм"]}
                            />
                        )}
                    </FormItem>
                </div>
            </div>
        )
    }
}

PersonalDataSkill.propTypes = {
    profile: PropTypes.object
};

PersonalDataSkill.defaultProps = {
    profile: {}
};

export default PersonalDataSkill
