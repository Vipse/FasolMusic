import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import {Form} from 'antd'
import Button from '../Button'
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";

const FormItem = Form.Item;

class PersonalDataSkill extends React.Component {
    constructor() {
        super();
        this.state = {
            addedCount: 0
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profile.disciplines.length !== this.props.profile.disciplines.length)
            this.setState({addedCount: 0});
    }

    generateDisciplineItem = (number, data = {}) => {
        const { getFieldDecorator, isStudent } = this.props;
        const { discipline, specialization, level, experience, methods, goals, musicstyles, favoritesingers } = data;
        const { length } = this.props.profile.disciplines;
        const { addedCount } = this.state;

        return <div className='coach-data-skill' key={'discipline' + number}>
            <FormItem className="input-form-item">
                {getFieldDecorator('discipline-' + number, {
                    initialValue: discipline,
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
                {getFieldDecorator('specialization-' + number, {
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
                {getFieldDecorator('level-' + number, {
                    initialValue: level,
                    rules: [{
                        required: true,
                        message: 'Введите уровень подготовки, пожалуйста'
                    }],
                })(
                    <InputNew width="100%" bubbleplaceholder="Уровень подготовки"/>
                )}
            </FormItem>
            <FormItem className="input-form-item">
                {getFieldDecorator('experience-' + number, {
                    initialValue: experience,
                    rules: [{
                        required: true,
                        message: 'Выберите опыт занятия, пожалуйста'
                    }],
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Опыт занятия"
                               data={["Спорт", "Кино и сериалы", "Туризм"]}
                    />
                )}
            </FormItem>
            <FormItem className="input-form-item">
                {getFieldDecorator('goals-' + number, {
                    initialValue: goals,
                    rules: [{
                        required: true,
                        message: 'Введите цели, пожалуйста'
                    }]
                })(
                    <InputNew width="100%" bubbleplaceholder="Цели"/>
                )}
            </FormItem>
            {!isStudent && <FormItem className="input-form-item">
                {getFieldDecorator('methods-' + number, {
                    initialValue: methods,
                    rules: [{
                        required: false,
                        message: 'Выберите приемы, пожалуйста'
                    }],
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Приемы"
                               mode="multiple"
                               data={["Спорт", "Кино и сериалы", "Туризм"]}
                    />
                )}
            </FormItem>}
            <FormItem className="input-form-item">
                {getFieldDecorator('musicstyles-' + number, {
                    initialValue: musicstyles,
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
                {getFieldDecorator('favoritesingers-' + number, {
                    initialValue: favoritesingers,
                    rules: [{
                        required: true,
                        message: 'Введите любимых исполнителей, пожалуйста'
                    }]
                })(
                    <InputNew width="100%" bubbleplaceholder="Любимые исполнители"/>
                )}
            </FormItem>
            {number < length + addedCount - 1 ?
                <div className="coach-data-skill-footer-line"/> :
                <div className="coach-data-skill-footer">
                    <Button
                        className="student-data-saveBtn"
                        onClick={() => this.setState({addedCount: addedCount + 1})}
                        btnText='Добавить'
                        size='small'
                        icon="plus"
                        iconSize={14}
                        type='light-blue'
                    />
                    {addedCount > 0 && <Button
                        className="student-data-saveBtn"
                        onClick={() => this.setState({addedCount: addedCount - 1})}
                        btnText='Убрать'
                        size='small'
                        icon="minus"
                        iconSize={14}
                        type='light-blue'
                    />}
                </div>
            }
        </div>
    };

    renderOldDisciplines = () => {
        const { disciplines } = this.props.profile;
        return disciplines.map((item, number) => this.generateDisciplineItem(number, item));
    };

    renderNewDisciplines = () => {
        const { length } = this.props.profile.disciplines;
        const { addedCount } = this.state;
        let newDisciplinesArr = [];
        for (let i = length; i < length + addedCount; ++i)
            newDisciplinesArr.push(this.generateDisciplineItem(i));
        return newDisciplinesArr;
    };

    render() {
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass + "disciplines"}>
                {this.renderOldDisciplines()}
                {this.renderNewDisciplines()}
            </div>
        )
    }
}

PersonalDataSkill.propTypes = {
    profile: PropTypes.object,
    isStudent: PropTypes.bool
};

PersonalDataSkill.defaultProps = {
    profile: {},
    isStudent: false
};

export default PersonalDataSkill
