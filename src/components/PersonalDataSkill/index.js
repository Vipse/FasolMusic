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
            addedNums: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profile.disciplines.length !== this.props.profile.disciplines.length)
            this.setState({addedNums: []});
    }

    addDiscipline = (num) => {
        const { addedNums } = this.state;

        let newAddedNumsArr = [...addedNums];
        newAddedNumsArr.push(num);

        this.setState({addedNums: newAddedNumsArr});
    };

    deleteDiscipline = (num) => {
        const { profile: { disciplines }, form } = this.props;
        const { addedNums } = this.state;

        for (let key in disciplines[0])
            form.resetFields([key + '-' + [num]]);
        addedNums.splice(addedNums.indexOf(num), 1);
        this.setState({addedNums: addedNums});
    };

    generateDisciplineItem = (number, data = {}) => {
        const { isStudent } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { discipline, specialization, level, experience, methods, goals, musicstyles, favoritesingers } = data;
        const { length } = this.props.profile.disciplines;
        const { addedNums } = this.state;

        return <div className='coach-data-skill' key={'discipline' + number}>
            {number >= Math.min(...addedNums) ?
                <div className="coach-data-skill-footer">
                    <Button
                        className="student-data-saveBtn"
                        onClick={() => this.deleteDiscipline(number)}
                        btnText='Убрать'
                        size='small'
                        icon="minus"
                        iconSize={14}
                        type='light-blue'
                    />
                    <div className="coach-data-skill-footer-line"/>
                </div> : (!number || (!length && number === Math.min(...addedNums))) ? <span/> :
                    <div className="coach-data-skill-footer-line" style={{width: "80%"}}/>}
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
                        required: false,
                        message: 'Введите специализацию, пожалуйста'
                    }],
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Специализация"
                               data={["Спорт", "Кино и сериалы", "Туризм"]}
                    />
                )}
            </FormItem>
            <FormItem className="input-form-item">
                {getFieldDecorator('level-' + number, {
                    initialValue: level,
                    rules: [{
                        required: false,
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
                        required: false,
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
                        required: false,
                        message: 'Введите цели, пожалуйста'
                    }]
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Цели"
                               mode="multiple"
                               data={["Спорт", "Кино и сериалы", "Туризм"]}
                    />
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
                        required: false,
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
                        required: false,
                        message: 'Введите любимых исполнителей, пожалуйста'
                    }]
                })(
                    <InputNew width="100%" bubbleplaceholder="Любимые исполнители"/>
                )}
            </FormItem>
            {number === Math.max(...addedNums) || (!addedNums.length && number === length - 1) ?
                <div className="coach-data-skill-footer">
                    <Button
                        className="student-data-saveBtn"
                        onClick={() => this.addDiscipline(number + 1)}
                        btnText='Добавить'
                        size='small'
                        icon="plus"
                        iconSize={14}
                        type='light-blue'
                    />
                </div> : null
            }
        </div>
    };

    renderOldDisciplines = () => {
        const { disciplines } = this.props.profile;

        return disciplines.map((item, number) => this.generateDisciplineItem(number, item));
    };

    renderNewDisciplines = () => {
        const { addedNums } = this.state;

        return addedNums.map((item) => this.generateDisciplineItem(item));
    };

    render() {
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass + ' disciplines'}>
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
