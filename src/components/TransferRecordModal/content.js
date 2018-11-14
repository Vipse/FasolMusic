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
        selectedDays: [],
        confirmed: false
    };

    componentWillMount() {
        this.setState({
            selectedDays: new Array(7).fill(false),
            confirmed: false
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

        if (!this.state.confirmed) return (
          <div className="TransferRecordModal">
              <p className="attention">Вы уверены, что хотите отменить эту тренировку?</p>
              <div className="TransferRecordModal-confirm">
                  <Button className="saveBtn"
                          btnText='Да'
                          onClick={() => {this.setState({confirmed: true})}}
                          size='small'
                          type='black'
                  />
                  <Button className="saveBtn"
                          btnText='Назад'
                          onClick={this.props.onCancel}
                          size='small'
                          type='light-pink'
                  />
              </div>
          </div>
        );
        else return (
            <Form onSubmit={this.handleSubmit}
                  className="TransferRecordModal">
                <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
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
                            isReset={true}
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
                            btnText='Сохранить'
                            onClick={() => {}}
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
