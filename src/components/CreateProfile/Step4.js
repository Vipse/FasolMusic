import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Checkbox from '../Checkbox'
import Button from '../Button'
import {Form, message} from "antd";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import Slider from "antd/es/slider";
import {getSelectedIDs, getSelectedNestedIDs} from "../../helpers/getSelectorsCustomData";

const FormItem = Form.Item;

class Step4Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            enabledDays: new Array(7).fill(false),
            selectedTimes: new Array(7).fill([[10, 20]])
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
            discipline: getSelectedIDs(disciplineList, discipline),
            specialization: getSelectedNestedIDs(disciplineList, specialization, [discipline]),
            level: level,
            experiense: experience,
            goals: getSelectedIDs(goalList, goals),
            musicstyles: getSelectedIDs(stylesList, musicstyles),
            favoritesingers: favoritesingers,
        }];
    };

    prepareTrainingTime = () => {
        const {dayList} = this.props.data.selectorsValues;
        const {enabledDays, selectedTimes} = this.state;
        let preparedTrainingTime = {};
        let objIndex = 0;

        for (let i = 0; i < 7; ++i) {
            enabledDays[i] && selectedTimes[i].forEach((interval) => {
                preparedTrainingTime[objIndex] = {
                    day: getSelectedIDs(dayList, String(i), true),
                    datestart: moment(interval[0], 'HH').format('X'),
                    dateend: moment(interval[1], 'HH').format('X')
                };
                ++objIndex;
            });
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
                    work: getSelectedIDs(professionsList, work),
                    interests: getSelectedIDs(interestsList, interests),
                    avatar,
                    facebooklink: facebookLink,
                    googlelink: googleLink,

                    disciplines: this.prepareDisciplines(this.props.data),

                    bestsex: bestsex ? bestsex === "Мужской" ? "m" : "w" : "",
                    bestage,
                    bestishomework: bestishomework ? bestishomework === "Да" : "",
                    bestqualities: getSelectedIDs(qualitiesList, bestqualities),
                    bestcomment,

                    amountdays: values.amountdays,
                    trainingtime: this.prepareTrainingTime(),

                    password: "123456"
                };

                console.log("FINAL REG DATA", finalRegData);

                this.props.onFinish(finalRegData).then(res => {
                    if (res && res.data && !res.data.error)
                        this.props.onNext();
                    else if (res && res.data) {console.log(res.data.error);
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
        const {enabledDays, selectedTimes} = this.state;
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

        return (<div className="timeSchedule" key={i}>
            <Checkbox className="dayCheckbox" value={i} checked={enabledDays[i]}
                      onChange={() => this.handleActiveSlider(i)}
                      key={"enableDay" + i}>{daysName[i]}</Checkbox>
            <div className='daySliders' key={"daySliders" + i}>
                <p className="timePlate" key={"timePlate" + i}>{enabledDays[i] && this.generateTimePlate(i)}</p>
                {selectedTimes[i].map((item, it) => this.generateSlider(it, i))}
            </div>
            {enabledDays[i] &&
            <div className='slidersBtnPlate'>
                <Button className='addBtn'
                        size='file'
                        type='file'
                        icon='plus'
                        onClick={(e) => this.addSlider(e, i)}
                />
                {selectedTimes[i].length > 1 &&
                <Button className='deleteBtn'
                        size='file'
                        type='file'
                        icon='minus'
                        onClick={(e) => this.deleteSlider(e, i)}
                />}
            </div>}
        </div>);
    };

    addSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.state;
        let newArr = [...selectedTimes[dayNum], [10, 20]];

        this.handleChangeTimeSchedule('selectedTimes', dayNum, newArr);
    };

    deleteSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.state;
        let newArr = [...selectedTimes[dayNum]].slice(0, -1);

        this.handleChangeTimeSchedule('selectedTimes', dayNum, newArr);
    };

    generateSlider = (i, dayKey) => {
        const {enabledDays, selectedTimes} = this.state;

        if (enabledDays[dayKey] || !i) return (
            <Slider className={"slider-" + i}
                    range step={1} min={8} max={23}
                    value={[selectedTimes[dayKey][i][0], selectedTimes[dayKey][i][1]]}
                    disabled={!enabledDays[dayKey]}
                    onChange={(value) => this.handleChangeSlider(dayKey, i, value)}
                    key={"timeSelected" + dayKey + i}/>);
        else return null;
    };

    generateTimePlate = (i) => {
        const {selectedTimes} = this.state;

        return selectedTimes[i].map((interval) => {
            return (interval[1] - interval[0] === 24 ? "Весь день" :
                interval[0] + ":00 - " + (interval[1] !== 24 ? interval[1] : 0) + ":00")
        }).join(', ');
    };

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        for (let i = 1; i < 7; i++)
            timeScheduleArr.push(this.generateOneDay(i));
        timeScheduleArr.push(this.generateOneDay(0));
        return timeScheduleArr;
    };

    handleChangeTimeSchedule = (type, num, value) => {
        let newArray = this.state[type];
        newArray[num] = value;
        this.setState({
            [type]: newArray
        });
    };

    handleActiveSlider = (num) => {
        this.handleChangeTimeSchedule('enabledDays', num, !this.state.enabledDays[num]);
    };

    handleChangeSlider = (dayNum, sliderNum, value) => {
        const {selectedTimes} = this.state;
        let newArr = [...selectedTimes[dayNum]];
        newArr[sliderNum] = value;

        this.handleChangeTimeSchedule('selectedTimes', dayNum, newArr);
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
