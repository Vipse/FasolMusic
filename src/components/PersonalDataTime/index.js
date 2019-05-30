import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form} from 'antd'


import './style.css'
import '../../icon/style.css'
import Checkbox from "../Checkbox";
import Slider from "antd/es/slider";
import Button from "../Button";

const FormItem = Form.Item;

class PersonalDataTime extends React.Component {

    state = {
        nextSlidersValues: new Array(7).fill([])
    };

    componentDidMount() {
        const {selectedTimes} = this.props.trainingTime;
        if (selectedTimes) {
            let newNextSlidersValues = selectedTimes.map((interval, it) => this.checkAddSliderAvailability(it, interval, true));
            this.setState({nextSlidersValues: newNextSlidersValues});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {selectedTimes} = this.props.trainingTime;
        if (prevProps.trainingTime !== this.props.trainingTime && selectedTimes) {
            let newNextSlidersValues = selectedTimes.map((interval, it) => this.checkAddSliderAvailability(it, interval, true));
            this.setState({nextSlidersValues: newNextSlidersValues});
        }
    }

    handleActiveSlider = (num) => {
        const {enabledDays} = this.props.trainingTime;
        this.props.onChange('enabledDays', num, !enabledDays[num]);
    };

    handleChangeSlider = (dayNum, sliderNum, value) => {
        const {selectedTimes} = this.props.trainingTime;
        if (selectedTimes[dayNum].every((interval, it) => {
            let isOverlapInterval = ((value[0] >= interval[0] && value[0] <= interval[1])
                || (value[1] >= interval[0] && value[1] <= interval[1])
                || (value[0] <= interval[0] && value[1] >= interval[1]));

            return !isOverlapInterval || it === sliderNum;
        })) {
            let newArr = [...selectedTimes[dayNum]];
            newArr[sliderNum] = value;

            this.props.onChange('selectedTimes', dayNum, newArr);
        }
    };

    checkAddSliderAvailability = (dayNum, updatedDaySelectedTimes, notUpdateState) => {
        function compareIntervals(a, b) {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
        }

        const {nextSlidersValues} = this.state;
        let arrForCheck = [[0, 8 - 1], ...updatedDaySelectedTimes, [23 + 1, 24]].sort(compareIntervals);
        let foundedAvailableInterval = [];

        arrForCheck.some((item, it) => {
            if (it < arrForCheck.length - 1 && arrForCheck[it + 1][0] - item[1] >= 3) {
                foundedAvailableInterval = [item[1] + 1, arrForCheck[it + 1][0] - 1];
                return true;
            }
            return false;
        });

        if (!notUpdateState) {
            let newNextSlidersValuesArr = [...nextSlidersValues];
            newNextSlidersValuesArr[dayNum] = foundedAvailableInterval;

            this.setState({
                nextSlidersValues: newNextSlidersValuesArr
            });
        }
        else return foundedAvailableInterval;
    };

    addSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.props.trainingTime;
        const {nextSlidersValues} = this.state;

        let newArr = [...selectedTimes[dayNum], nextSlidersValues[dayNum]];
        this.props.onChange('selectedTimes', dayNum, newArr);
        this.checkAddSliderAvailability(dayNum, newArr);
    };

    deleteSlider = (e, dayNum) => {
        e.preventDefault();
        const {selectedTimes} = this.props.trainingTime;
        const {nextSlidersValues} = this.state;
        let daySelectedTimes = [...selectedTimes[dayNum]];
        let deletedValues = daySelectedTimes.splice(-1, 1);

        let newNextSlidersValuesArr = [...nextSlidersValues];
        newNextSlidersValuesArr[dayNum] = deletedValues;

        this.setState({
            nextSlidersValues: newNextSlidersValuesArr
        });

        let newArr = daySelectedTimes;
        this.props.onChange('selectedTimes', dayNum, newArr);
        this.checkAddSliderAvailability(dayNum, newArr);
    };

    generateSlider = (i, dayKey) => {
        const {enabledDays, selectedTimes} = this.props.trainingTime;

        if (enabledDays[dayKey] || !i) return (
            <Slider className={"slider-" + i}
                    range step={1} min={9} max={23}
                    value={[selectedTimes[dayKey][i][0], selectedTimes[dayKey][i][1]]}
                    disabled={!enabledDays[dayKey]}
                    onChange={(value) => this.handleChangeSlider(dayKey, i, value)}
                    onAfterChange={() => this.checkAddSliderAvailability(dayKey, selectedTimes[dayKey])}
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
        const {nextSlidersValues} = this.state;
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

        return (<div className="timeSchedule" key={i}>
            <Checkbox className="dayCheckbox largeChk" value={i} checked={enabledDays[i]}
                      onChange={() => this.handleActiveSlider(i)}
                      key={"enableDay" + i}>{daysName[i]}</Checkbox>
            <div className='daySliders' key={"daySliders" + i}>
                <p className="timePlate" key={"timePlate" + i}>{enabledDays[i] && this.generateTimePlate(i)}</p>
                {selectedTimes[i].map((item, it) => this.generateSlider(it, i))}
            </div>
            <div className='slidersBtnPlate'>
                {(enabledDays[i] && nextSlidersValues[i].length) ?
                    <Button className='addBtn'
                            size='file'
                            type='file'
                            icon='plus'
                            title='Добавить новый интервал'
                            onClick={(e) => this.addSlider(e, i)}
                    /> : null}
                {selectedTimes[i].length > 1 &&
                <Button className='deleteBtn'
                        size='file'
                        type='file'
                        icon='minus'
                        title='Убрать последний интервал'
                        onClick={(e) => this.deleteSlider(e, i)}
                />}
            </div>
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
