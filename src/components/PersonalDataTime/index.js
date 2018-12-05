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
        this.state = {
            enabledDays: [],
            selectedTimes: []
        }
    }

    componentWillMount() {
        this.setState({
            enabledDays: new Array(7).fill(false),
            selectedTimes: new Array(7).fill([10, 23])
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.profile.id !== nextProps.profile.id) {
            for (let num in nextProps.profile.trainingtime) {
                this.handleActiveSlider(num);
                this.handleChangeSlider(num, [
                    nextProps.profile.trainingtime[num].datestart,
                    nextProps.profile.trainingtime[num].dateend
                ]);
            }
        }
    }

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        let daysName = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        for (let i = 0; i < 7; i++)
            timeScheduleArr.push(<div className="timeSchedule" key={i}>
                <Checkbox className="dayCheckbox largeChk" value={i} checked={this.state.enabledDays[i]}
                          onChange={() => this.handleActiveSlider(i)}
                          key={"enableDay" + i}>{daysName[i]}</Checkbox>
                <Slider className="slider" range step={1} min={0} max={24} defaultValue={[10, 23]}
                        disabled={!this.state.enabledDays[i]}
                        onChange={(value) => this.handleChangeSlider(i, value)} key={"timeSelected" + i}/>
                <p className="timePlate">{this.state.enabledDays[i] &&
                (this.state.selectedTimes[i][1] - this.state.selectedTimes[i][0] === 24 ? "Весь день" :
                    this.state.selectedTimes[i][0] + ":00 - " + (this.state.selectedTimes[i][1] !== 24 ? this.state.selectedTimes[i][1] : 0) + ":00")}</p>
            </div>);
        return timeScheduleArr;
    };

    handleActiveSlider = (num) => {
        let newEnableSlider = this.state.enabledDays;
        newEnableSlider[num] = !newEnableSlider[num];
        this.setState({
            enabledDays: newEnableSlider
        });
        this.props.onChange('enabledDays', newEnableSlider);
    };

    handleChangeSlider = (num, value) => {
        let newSliderValue = this.state.selectedTimes;
        newSliderValue[num] = value;
        this.setState({
            selectedTimes: newSliderValue
        });
        this.props.onChange('selectedTimes', newSliderValue);
    };

    checkIsTimeSelected = (role, email, callBack) => {
        if (this.state.enabledDays.includes(true)) callBack();
        else callBack("Выберите удобное время, пожалуйста");
    };

    render() {
        const {getFieldDecorator} = this.props;
        const rootClass = cn('coach-data-form');

        return (
            <div className='coach-data-block'>
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
    profile: PropTypes.object
};

PersonalDataTime.defaultProps = {
    profile: {}
};

export default PersonalDataTime
