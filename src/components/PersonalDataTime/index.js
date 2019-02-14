import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'


import './style.css'
import '../../icon/style.css'
import Checkbox from "../Checkbox";
import Slider from "antd/es/slider";
import Button from "../Button";

const FormItem = Form.Item;

class PersonalDataTime extends React.Component {

    handleActiveSlider = (num) => {
        this.props.onChange('enabledDays', num, !this.props.trainingTime.enabledDays[num]);
    };

    handleChangeSlider = (dayNum, sliderNum, value) => {
        const {selectedTimes} = this.props.trainingTime;
        let newArr = [...selectedTimes[dayNum]];
        newArr[sliderNum] = value;

        this.props.onChange('selectedTimes', dayNum, newArr);
    };

    addSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.props.trainingTime;
        let newArr = [...selectedTimes[dayNum], [10, 20]];

        this.props.onChange('selectedTimes', dayNum, newArr);
    };

    deleteSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.props.trainingTime;
        let newArr = [...selectedTimes[dayNum]].slice(0, -1);

        this.props.onChange('selectedTimes', dayNum, newArr);
    };

    generateSlider = (i, dayKey) => {
        const {enabledDays, selectedTimes} = this.props.trainingTime;

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
        const {selectedTimes} = this.props.trainingTime;

        return selectedTimes[i].map((interval) => {
            return (interval[1] - interval[0] === 24 ? "Весь день" :
                interval[0] + ":00 - " + (interval[1] !== 24 ? interval[1] : 0) + ":00")
        }).join(', ');
    };

    generateOneDay = (i) => {
        const {enabledDays, selectedTimes} = this.props.trainingTime;
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

        return (<div className="timeSchedule" key={i}>
            <Checkbox className="dayCheckbox largeChk" value={i} checked={enabledDays[i]}
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

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        for (let i = 1; i < 7; i++)
            timeScheduleArr.push(this.generateOneDay(i));
        timeScheduleArr.push(this.generateOneDay(0));
        return timeScheduleArr;
    };

    checkIsTimeSelected = (role, email, callBack) => {
        const { enabledDays } = this.props.trainingTime;
        if (enabledDays.includes(true)) callBack();
        else callBack("Выберите удобное время, пожалуйста");
    };

    render() {
        const {getFieldDecorator} = this.props;
        const rootClass = cn('coach-data-block');

        return (
            <div className={rootClass}>
                <div className='coach-data-comfortTime'>
                    <FormItem className='input-form-item'>
                        {getFieldDecorator('comfortTime', {
                            rules: [{
                                validator: this.checkIsTimeSelected
                            }],
                        })(
                            <div className="ant-radio-group">
                                {this.renderTimeSchedule()}
                            </div>
                        )}
                    </FormItem>
                </div>
            </div>
        )
    }
}

PersonalDataTime.propTypes = {
    trainingTime: PropTypes.object
};

PersonalDataTime.defaultProps = {
    trainingTime: {}
};

export default PersonalDataTime
