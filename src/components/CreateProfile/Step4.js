import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Checkbox from '../Checkbox'
import Button from '../Button'
import {Form, message} from "antd";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import Slider from "antd/es/slider";
import {getSelectorIDs, getSelectorNestedIDs, getSelectorValues} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class Step4Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            enabledDays: new Array(7).fill(false),
            selectedTimes: new Array(7).fill([10, 23])
        }
    }

    componentDidMount() {
        if (this.props.data.enabledDays && this.props.data.selectedTimes)
            this.setState({enabledDays: this.props.data.enabledDays, selectedTimes: this.props.data.selectedTimes});
    }

    prepareDisciplines = (data) => {
        const {discipline, specialization, level, experience, goals, musicstyles, favoritesingers} = data;
        const {disciplineList, goalList, stylesList} = data.selectorsValues;
        return [{
            discipline: getSelectorIDs(disciplineList, discipline),
            specialization: getSelectorNestedIDs(disciplineList, specialization, discipline),
            level: level,
            experiense: experience,
            goals: getSelectorIDs(goalList, goals),
            musicstyles: getSelectorIDs(stylesList, musicstyles),
            favoritesingers: favoritesingers,
        }];
    };

    prepareTrainingTime = () => {
        const {dayList} = this.props.data.selectorsValues;
        let preparedTrainingTime = {};
        for (let i = 0; i < 7; ++i) {
            this.state.enabledDays[i] ? preparedTrainingTime[i] = {
                day: dayList[getSelectorValues(dayList, true).indexOf(String(i))][0].id,
                datestart: this.state.selectedTimes[i][0],
                dateend: this.state.selectedTimes[i][1]
            } : null;
        }
        return preparedTrainingTime;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const {name, datebirth, email, phones, sex, country, work, interests, avatar, facebookLink, googleLink,
                bestsex, bestage, bestishomework, bestqualities, bestcomment} = this.props.data;
            const {interestsList, qualitiesList, professionsList} = this.props.data.selectorsValues;
            if (!err) {
                const finalRegData = {
                    name,
                    datebirth: moment(datebirth).format('X'),
                    email,
                    phones,
                    sex: sex ? sex === "Мужской" ? "m" : "w" : "",
                    country,
                    work: getSelectorIDs(professionsList, work),
                    interests: getSelectorIDs(interestsList, interests),
                    avatar,
                    facebooklink: facebookLink,
                    googlelink: googleLink,

                    disciplines: this.prepareDisciplines(this.props.data),

                    bestsex: bestsex ? bestsex === "Мужской" ? "m" : "w" : "",
                    bestage,
                    bestishomework: bestishomework ? bestishomework === "Да" : "",
                    bestqualities: getSelectorIDs(qualitiesList, bestqualities),
                    bestcomment,

                    amountdays: values.amountdays,
                    trainingtime: this.prepareTrainingTime(),

                    password: "123456"
                };

                console.log("FINAL REG DATA", finalRegData);
                this.props.onFinish(finalRegData).then(res => {
                    if (res && !res.data.error)
                        this.props.onNext();
                    else {
                        console.log(res.data.error);
                        message.error('Ошибка ' + res.data.error.code + ': ' + res.data.error.text, 10);
                        //message.error('Заполнены не все обязательные поля', 4);
                    }
                });
            }
            else
                console.log(err);
        });
    };

    handleGoBack = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const fields = {
                amountdays: values.amountdays,
                ...this.state
            };

            this.props.onSubmit(fields);
            this.props.onPrev();
        });
    };

    checkIsTimeSelected = (rule, value, callback) => {
        const {enabledDays} = this.state;
        if (enabledDays.every((item) => !item)) {
            callback('Выберите время, пожалуйста');
        } else {
            callback();
        }
    };

    generateOneDay = (i) => {
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const {enabledDays, selectedTimes} = this.state;

        return (<div className="timeSchedule" key={i}>
            <Checkbox className="dayCheckbox" value={i} checked={enabledDays[i]} onChange={() => this.handleActiveSlider(i)}
                      key={"enableDay" + i}>{daysName[i]}</Checkbox>
            <Slider className="slider" range step={1} min={0} max={24}
                    value={[selectedTimes[i][0], selectedTimes[i][1]]}
                    disabled={!enabledDays[i]}
                    onChange={(value) => this.handleChangeSlider(i, value)} key={"timeSelected" + i}/>
            <p className="timePlate">{enabledDays[i] &&
            (selectedTimes[i][1] - selectedTimes[i][0] === 24 ? "Весь день" :
                selectedTimes[i][0] + ":00 - " + (selectedTimes[i][1] !== 24 ? selectedTimes[i][1] : 0) + ":00")}</p>
        </div>);
    };

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        for (let i = 1; i < 7; i++)
            timeScheduleArr.push(this.generateOneDay(i));
        timeScheduleArr.push(this.generateOneDay(0));
        return timeScheduleArr;
    };

    handleActiveSlider = (num) => {
        let newEnableSlider = this.state.enabledDays;
        newEnableSlider[num] = !newEnableSlider[num];
        this.setState({
            enabledDays: newEnableSlider
        });
    };

    handleChangeSlider = (num, value) => {
        let newSliderValue = this.state.selectedTimes;
        newSliderValue[num] = value;
        this.setState({
            selectedTimes: newSliderValue
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="step-form step-4">
                <div className="step-title">Удобное время занятий</div>
                <div className="step-note">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur
                    eligendi harum hic itaque iusto neque porro recusandae. Accusamus corporis culpa est facere, in
                    pariatur porro reprehenderit similique sit tempora? Nisi!
                </div>
                <div className="step-form-row">
                    <FormItem>
                        <div className='radio-label radio-label-amountdays'>Количество дней в неделю:</div>
                            {getFieldDecorator('amountdays', {
                                rules: [{ required: true,
                                    message: 'Выберите количество дней, пожалуйста' }],
                            })(
                                <RadioGroup className="ant-radio-group" style={{display: "flex", flexDirection: "column"}}>
                                    <Radio value='1' key='radio-1'>1</Radio>
                                    <Radio value='2' key='radio-2'>2</Radio>
                                    <Radio value='3' key='radio-3'>3</Radio>
                                    <Radio value='4' key='radio-4'>4</Radio>
                                    <Radio value='5' key='radio-5'>5</Radio>
                                    <Radio value='5+' key='radio-5+'>5 и более</Radio>
                                </RadioGroup>
                            )}
                    </FormItem>
                    <FormItem>
                        <div className='radio-label'>Время:</div>
                            {getFieldDecorator('timeSchedule', {
                                rules: [
                                    {
                                        validator: this.checkIsTimeSelected,
                                    }],
                            })(
                                <div className="ant-radio-group">
                                    {this.renderTimeSchedule()}
                                </div>
                            )}
                    </FormItem>
                </div>

                <div className="steps-action">
                    <Button btnText='Назад'
                            size='large'
                            type='pink'
                            onClick={this.handleGoBack}/>
                    <Button htmlType="submit"
                            btnText='Продолжить'
                            size='large'
                            type='pink'/>
                </div>
            </Form>
        )
    }
}

const Step4 = Form.create({
    mapPropsToFields(props) {
        let fields ={};
        for (let key in props.data){
            if (key !== 'current'){
                fields[key] = Form.createFormField({
                    value: props.data[key],
                })
            }
        }
        return fields;
    },
})(Step4Form);

Step4.propTypes = {
    data: PropTypes.object,
    onFinish: PropTypes.func,
};

Step4.defaultProps = {
    data: {},
    onFinish: () => {}
};

export default Step4
