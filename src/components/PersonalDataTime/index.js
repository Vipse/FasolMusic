import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'


import './style.css'
import '../../icon/style.css'
import Checkbox from "../Checkbox";
import Slider from "antd/es/slider";

const FormItem = Form.Item;

class PersonalDataTime extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    handleActiveSlider = (num) => {
        this.props.onChange('enabledDays', num, !this.props.trainingTime.enabledDays[num]);
    };

    handleChangeSlider = (num, value) => {
        this.props.onChange('selectedTimes', num, value);
    };

    generateOneDay = (i) => {
        const {enabledDays, selectedTimes} = this.props.trainingTime;
        const daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

        return (<div className="timeSchedule" key={i}>
            <Checkbox className="dayCheckbox largeChk" value={i} checked={enabledDays[i]}
                      onChange={() => this.handleActiveSlider(i)}
                      key={"enableDay" + i}>{daysName[i]}</Checkbox>
            <Slider className="slider"
                    range step={1} min={0} max={24}
                    value={[selectedTimes[i][0], selectedTimes[i][1]]}
                    disabled={!enabledDays[i]}
                    onChange={(value) => this.handleChangeSlider(i, value)}
                    key={"timeSelected" + i}/>
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
