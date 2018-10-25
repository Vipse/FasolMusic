import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import {Form, message} from 'antd'
import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'


import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";
import DatePickerNew from "../DatePickerNew";
import Checkbox from "../Checkbox";
import Slider from "antd/es/slider";

const FormItem = Form.Item;

class CoachPersonalDataTimeForm extends React.Component{
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

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        let daysName = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        for (let i = 0; i < 7; i++)
            timeScheduleArr.push(<div className="timeSchedule">
                <Checkbox className="dayCheckbox largeChk" value={i} checked={this.state.enabledDays[i]} onChange={() => this.handleActiveSlider(i)}
                          key={"enableDay" + i}>{daysName[i]}</Checkbox>
                <Slider className="slider" range step={1} min={0} max={23} defaultValue={[10, 23]} disabled={!this.state.enabledDays[i]}
                        onChange={(value) => this.handleChangeSlider(i, value)} key={"timeSelected" + i}/>
                <p className="timePlate">{this.state.enabledDays[i] && this.state.selectedTimes[i][0] + ":00 - " + this.state.selectedTimes[i][1] + ":00"}</p>
            </div>);
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
        const rootClass = cn('coach-data-form');

        return (
            <Form className={rootClass}>
                <div className='coach-data-title'>Удобное время проведения тренировок</div>
                <div className='coach-data-block'>
                    <div className='coach-data-comfortTime'>
                        <FormItem className='input-form-item'>
                            {getFieldDecorator('comfortTime', {
                                rules: [{ required: true,
                                    message: 'Выберите удобное время, пожалуйста' }],
                            })(
                                <div className="ant-radio-group">
                                    {this.renderTimeSchedule()}
                                </div>
                            )}
                        </FormItem>
                    </div>
                </div>

            </Form>
        )
    }
}

const CoachPersonalDataTime  = Form.create()(CoachPersonalDataTimeForm);

CoachPersonalDataTime.propTypes = {
    profileCoach: PropTypes.object
};

CoachPersonalDataTime.defaultProps = {
    profileCoach: {}
};

export default CoachPersonalDataTime
