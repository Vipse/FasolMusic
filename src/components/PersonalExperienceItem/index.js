import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Select from '../Select'

import './style.css'
import '../../icon/style.css'
import {Form} from "antd/lib/index";
import addInfoObj from "../../helpers/addInfoObj";
import InputNew from "../InputNew";
import DropZoneUpload from "../DropZoneUpload";

const FormItem = Form.Item;
const Option = Select.Option;

class PersonalExperienceItemForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            experBlock: 0,
            experience: props.profileCoach.experience || null,
            works: props.profileCoach.works || [],
            category: {name: props.profileCoach.category || "", doc: props.profileCoach.copycontract || []}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (!err && this.state.experBlock === 0) {
                this.props.form.resetFields();
                this.setState({experBlock: 0});
                let toSubmitObj = {
                    works: this.state.works,
                    experience: this.state.experience,
                    category: this.state.category.name,
                    categorydoc: this.state.category.doc,
                    educationsgroup1: this.props.profileCoach.educationsgroup1, // fix server bug
                    educationsgroup2: this.props.profileCoach.educationsgroup2 // fix server bug
                };
                this.props.onSubmit(toSubmitObj);
            }
        });
    };

    addDp = () => { this.setState({experBlock: 1}) };

    renderDp = (getFieldDecorator) =>{
        let dpArr = [];

        if(this.state.experBlock === 1) {
            dpArr.push(
                <div className="personal-item" key={1}>

                    <FormItem>
                        {getFieldDecorator('work-worknow', {
                            rules: [{
                                required: true,
                                message: 'Введите текущее место работы'
                            }],
                        })(

                            <InputNew width ="100%" bubbleplaceholder="* Текущее место работы" className="step-form-item"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('work-adress', {
                            rules: [{
                                required: true,
                                message: 'Введите адрес места работы'
                            }],
                        })(
                            <InputNew width ="100%" bubbleplaceholder="* Адрес места работы" className="step-form-item"/>

                        )}
                    </FormItem>


                    <div className="step-row">
                        <FormItem>
                            {getFieldDecorator('work-post', {
                                rules: [{
                                    required: true,
                                    message: 'Введите текущую должность'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="* Должность" className="step-form-item"/>

                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('work-copycontract', {
                                rules: [{
                                    required: true,
                                    message: 'Загрузите подтверждающий документ'
                                }],
                            })(
                                <DropZoneUpload
                                    uploadFile = {this.props.uploadFile}
                                    text="Прикрепить копию контракта"
                                />
                            )}
                        </FormItem>

                    </div>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    let newWorksEntry = {
                                        worknow: values['work-worknow'],
                                        adress: values['work-adress'],
                                        post: values['work-post'],
                                        copycontract: values['work-copycontract']
                                    };
                                    this.setState({
                                        experBlock: 0,
                                        works: [...this.state.works, newWorksEntry]
                                    });
                                }
                            });
                        }}
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr}
            </div>
        );
    };

    addDp2 = () => {
        this.setState({experBlock: 2})
    };

    renderDp2 = (getFieldDecorator) =>{
        let dpArr2 = [];
        if(this.state.experBlock === 2) {
            dpArr2.push(
                <div className="personal-item" key={2}>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('changeCategoryField', {
                            rules: [{
                                required: true,
                                message: 'Выберите категорию'
                            }],
                        })(
                            <Select placeholder="Категория">
                                {addInfoObj.category.map((item) => <Option value={item}>{item}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('uploadCategory', {
                        })(
                            <DropZoneUpload
                                uploadFile={this.props.uploadFile}
                                text="Прикрепить документ, подтверждающий категорию"
                            />
                        )}
                    </FormItem>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    this.setState({
                                        experBlock: 0,
                                        category: {name: values['changeCategoryField'], doc: values['uploadCategory']}
                                    });
                                }
                            })
                        }
                        }
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr2}
            </div>
        );
    };

    addDp3 = () => {
        this.setState({experBlock: 3})
    };

    renderDp3 = (getFieldDecorator) => {
        let dpArr3 = [];
        if(this.state.experBlock === 3) {
            dpArr3.push(
                <div className="personal-item" key={3}>
                    <FormItem className="personal-item">

                        {getFieldDecorator('experience', {
                            rules: [{
                                required: true,
                                message: 'Введите общий стаж работы'
                            }],
                        })(
                            <InputNew width ="100%" bubbleplaceholder="* Общий стаж работы" className="step-form-item"/>
                        )}
                    </FormItem>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    this.setState({
                                        experBlock: 0,
                                        experience: values.experience
                                    });
                                }
                            })
                        }
                        }
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr3}
            </div>
        );
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.profileCoach && JSON.stringify(nextProps.profileCoach) !== JSON.stringify(this.props.profileCoach)) {
            this.setState({
                experience: nextProps.profileCoach.experience,
                works: nextProps.profileCoach.works,
                category: {name: nextProps.profileCoach.category, doc: nextProps.profileCoach.copycontract}
            });
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {experience, works, category} = this.state;

        let worksView = works.map((elem, i) => {
            return (
                <div key={elem.id} className="personal-item brd-b brd-d">
                    <div className="personal-info">
                        <div className="personal-info"><p><b>{elem.worknow}</b></p></div>
                        <div className="personal-info"><p>{elem.adress}</p></div>
                        <div className="personal-info"><p>{elem.post}</p></div>
                    </div>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            let newWorks = this.state.works;
                            newWorks.splice(i, 1);
                            this.setState({works: newWorks});
                        }}
                        className="personal-delete"
                        size='small'
                        type='blue-float'
                        icon='close'
                        iconSize={17}
                        svg
                    />
                </div>);
        });

        const rootClass = cn('personal-experience');

        return (
            <Form className={rootClass} onSubmit={this.handleSubmit}>
                <div className="personal-block">
                    <div className="personal-item">
                        <div className="personal-title">Текущие места работы</div>
                    </div>

                    {worksView}

                    {this.state.experBlock !== 1 && <div className="personal-item">
                        <Button onClick={this.addDp}
                                className="personal-btn"
                                btnText='Добавить'
                                size='small'
                                type='no-brd'
                                icon='plus'
                                iconSize={11}
                                svg
                        />
                    </div>}
                    {this.renderDp(getFieldDecorator)}
                </div>

                <div className="personal-block">
                    <div className="personal-title">Категория</div>

                    <div className="personal-item mb-35">
                        <div className="personal-info">{category.name}</div>

                    {this.state.experBlock !== 2 &&
                        <Button onClick={this.addDp2}
                                className="personal-edit"
                                size='small'
                                type='blue-float'
                                icon='setting_edit'
                                iconSize={17}
                                svg
                        />}
                    </div>
                    {this.renderDp2(getFieldDecorator)}
                </div>

                <div className="personal-block">
                        <div className="personal-title">Опыт работы</div>

                    <div className="personal-item mb-35">
                    <div className="personal-info">{experience}</div>

                    {this.state.experBlock !== 3 &&
                        <Button onClick={this.addDp3}
                                className="personal-edit"
                                size='small'
                                type='blue-float'
                                icon='setting_edit'
                                iconSize={17}
                                svg
                        />}
                    </div>
                    {this.renderDp3(getFieldDecorator)}
                </div>

                <div className="personal-block">
                    <Button
                        htmlType="submit"
                        btnText='Сохранить изменения'
                        size='default'
                        type='float'
                    />
                </div>
            </Form>
        )
    }
}

const PersonalExperienceItem  = Form.create()(PersonalExperienceItemForm);

PersonalExperienceItem.propTypes = {
    profileCoach: PropTypes.object
};

PersonalExperienceItem.defaultProps = {
    profileCoach: {}
};

export default PersonalExperienceItem
