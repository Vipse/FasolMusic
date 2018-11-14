import React from 'react';
import moment from 'moment'
import {Form, message} from 'antd';
import TimePicker from '../TimePicker'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Spinner from "../Spinner";
import SelectNew from "../SelectNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        selectedDays: []
    };

    componentWillMount() {
        this.setState({
            selectedDays: new Array(7).fill(false)
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //this.setState({loading: true});
                let fasolIntervals = this.state.selectedDays.map((item, i) => {
                    return {
                        day: i,
                        intervals: item ? [{start: values.time[0].format('X') * 1000, end: values.time[1].format('X') * 1000}] : []
                    }
                });
                let finalData = {
                    subject: values.subject,
                    fasolIntervals: fasolIntervals
                };

                this.props.onSave(finalData);
            }
            else console.log("error", err);
        })
    };

    checkGroupValidator = (rule, value, callback) => {
        if (this.state.selectedDays.includes(true)) callback();
        callback('Выберите день, пожалуйста');
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
            timeScheduleArr.push(<Checkbox className={"circleFilled" + (this.state.selectedDays[i] ? "-checked" : "")}
                                           value={i} checked={this.state.selectedDays[i]}
                                           onChange={() => this.handleDayCheck(i)}
                                           key={"selectDay" + i}>{daysName[i]}</Checkbox>);
        return timeScheduleArr;
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const subjectArr = this.props.subjects.length ? this.props.subjects : ['Гитара', 'Вокал'];

        return (
        <Form onSubmit={this.handleSubmit}
                      className="TrialTrainModal">
                <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <div className="item">
                    <FormItem>
                        <div className='radio-label'>Выбери дисциплину</div>
                        {getFieldDecorator('subject', {
                            initialValue: subjectArr[0],
                            rules: [{
                                required: true,
                                message: 'Выберите дисциплину, пожалуйста'
                            }],
                        })(
                            <SelectNew width ="80%"
                                data={subjectArr}/>
                        )}
                    </FormItem>
                    <p className="info-small">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.
                    </p>
                </div>
                <div className="item">
                    <FormItem>
                        <div className='radio-label'>Выбери дни</div>
                        {getFieldDecorator('days', {
                            rules: [{
                                validator: this.checkGroupValidator
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
                                required: true,
                                message: 'Выберите интервал времени, пожалуйста'
                            }],
                        })(
                            <TimePicker
                                range
                                delimiter='&mdash;'
                                isReset={true}
                                availableArea={[{
                                    from: 1528318800000,
                                    to: 1528318800000 - 1
                                }]}
                            />
                        )}
                    </FormItem>
                </div>
                <div className="submitPlate">
                    <Button className="saveBtn"
                            btnText='Далее'
                            onClick={() => {
                            }}
                            size='default'
                            type='light-pink'
                    />
                    {this.state.loading && <Spinner/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
