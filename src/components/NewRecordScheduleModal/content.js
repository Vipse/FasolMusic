import React from 'react';
import moment from 'moment'
import {Form, message} from 'antd';
import TextArea from '../TextArea'
import Upload from '../Upload'
import Icon from '../Icon'
import TimePicker from '../TimePicker'
import {previewFile} from "../../helpers/modifyFiles";
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import RangeTp from "../TimePicker/RangeTP";
import Slider from "antd/es/slider";
import NewRecordScheduleModal from "./index";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        selectedDays: []
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true});
                let selectedDaysObj = {};
                this.state.selectedDays.forEach((item, i) => this.state.selectedDays[i] ? selectedDaysObj[i] = item : null);
                let finalData = {
                    ...values,
                    selectedDays: selectedDaysObj
                };
                console.log("FINAL REG DATA", finalData);
                this.props.onSave(finalData);
            }
            else console.log("error", err);
        })
    };

    handleDayCheck = (num) => {
        let newSelectedState = this.state.selectedDays;
        newSelectedState[num] = !newSelectedState[num];
        this.setState({
            selectedDays: newSelectedState
        });
    };

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        let daysName = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        for (let i = 0; i < 7; i++)
            timeScheduleArr.push(<Checkbox className="dayCheckbox"
                                           value={i} checked={this.state.selectedDays[i]}
                                           onChange={() => this.handleDayCheck(i)}
                                           key={"selectDay" + i}>{daysName[i]}</Checkbox>);
        return timeScheduleArr;
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}
                  className="NewRecordScheduleModal">
                <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <FormItem>
                    <div className='radio-label'>Выбери дисциплину</div>
                    {getFieldDecorator('type', {
                        rules: [{
                            required: false,
                            message: 'Выберите дисциплину, пожалуйста'
                        }],
                    })(
                        <div className="ant-radio-group">
                            <RadioGroup style={{display: "flex", flexDirection: "row"}}>
                                <Radio value='guitar' key='radio-guitar'>Гитара</Radio>
                                <Radio value='vocals' key='radio-vocal'>Вокал</Radio>
                            </RadioGroup>
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    <div className='radio-label'>Выбери дни</div>
                    {getFieldDecorator('days', {
                        rules: [{
                            required: false,
                            message: 'Выберите дни, пожалуйста'
                        }],
                    })(
                        <div className="ant-radio-group">
                            {this.renderTimeSchedule()}
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    <div className='radio-label'>Интервал предпочитаемого времени</div>
                    {getFieldDecorator('time', {
                        rules: [{
                            required: false,
                            message: 'Выберите интервал времени, пожалуйста'
                        }],
                    })(
                        <TimePicker
                            range
                            isReset={false}
                            rangeSet={[
                                {
                                    defaultStartValue: moment(1318781876),
                                    defaultEndValue: moment(1378781876)
                                }
                            ]}
                            delimiter='&mdash;'
                            availableArea={[{
                                from: 1528318800000,
                                to: 1528318800000 - 1
                            }]}
                        />
                    )}
                </FormItem>
                <div className="submitPlate">
                    <Button className="saveBtn"
                            btnText='Далее'
                            onClick={() => {}}
                            size='default'
                            type='yellow-black'
                    />
                    {this.state.loading && <Spinner/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
