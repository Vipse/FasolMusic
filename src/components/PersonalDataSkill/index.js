import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import './style.css'
import '../../icon/style.css'

import {Form} from 'antd'
import Button from '../Button'
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";
import {getNameFromObjArr, getNamesFromObjArr} from "../../helpers/getSelectorsCustomData";

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
        const {form, isStudent, disciplineList, specializationList, goalList, stylesList} = this.props;
        const {getFieldDecorator} = form;
        const {discipline, specialization, level, experiense, methods, goals, musicstyles, favoritesingers} = data;
        const {length} = this.props.profile.disciplines;
        const {addedNums} = this.state;

        const resetSpecialization = () => {
            this.props.form.setFieldsValue({['specialization-' + number]: ""});
        };

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
                    initialValue: getNameFromObjArr(discipline),
                    rules: [{
                        required: true,
                        message: 'Выберите дисциплину, пожалуйста'
                    }],
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Дисциплина"
                               data={disciplineList}
                               onChange={resetSpecialization}
                    />
                )}
            </FormItem>
            <FormItem className="input-form-item">
                {getFieldDecorator('specialization-' + number, {
                    initialValue: getNameFromObjArr(specialization),
                    rules: [{
                        required: true,
                        message: 'Выберите специализацию, пожалуйста'
                    }],
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Специализация"
                               data={specializationList[form.getFieldValue('discipline-' + number)] ?
                                   specializationList[form.getFieldValue('discipline-' + number)] : []}
                    />
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
                    initialValue: experiense,
                    rules: [{
                        required: true,
                        message: 'Введите опыт занятия, пожалуйста'
                    }],
                })(
                    <InputNew width="100%" bubbleplaceholder="Опыт занятия"/>
                )}
            </FormItem>
            <FormItem className="input-form-item">
                {getFieldDecorator('musicstyles-' + number, {
                    initialValue: getNameFromObjArr(musicstyles),
                    rules: [{
                        required: true,
                        message: 'Выберите предпочитаемый стиль музыки, пожалуйста'
                    }]
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Предпочитаемый стиль музыки"
                               data={stylesList}
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
            <FormItem className="input-form-item">
                {getFieldDecorator('goals-' + number, {
                    initialValue: getNamesFromObjArr(goals),
                    rules: [{
                        required: true,
                        message: 'Выберите цели, пожалуйста'
                    }]
                })(
                    <SelectNew width="100%"
                               bubbleplaceholder="Цели"
                               mode="multiple"
                               data={goalList}
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
        const {disciplines} = this.props.profile;
        return disciplines.map((item, number) => this.generateDisciplineItem(number, item));
    };

    renderNewDisciplines = () => {
        const { addedNums } = this.state;
        return addedNums.map((item) => this.generateDisciplineItem(item));
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
