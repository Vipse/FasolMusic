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
import InputNew from "../InputNew";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        selectedDays: [],
        promoCodeStep: true,
        promoCode: ""
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.visible && prevProps.visible !== this.props.visible)
            this.setState({promoCodeStep: true});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //this.setState({loading: true});
                this.setState({completed: true});
                let selectedDaysObj = {};
                this.state.selectedDays.forEach((item, i) => this.state.selectedDays[i] ? selectedDaysObj[i] = item : null);
                let finalData = {
                    ...values,
                    selectedDays: selectedDaysObj,
                    promoCode: this.state.promoCode
                };
                this.props.onSave(finalData);
            }
            else console.log("error", err);
        })
    };

    acceptPromo = (e) => {
        e.preventDefault();
        this.setState({
            promoCode: this.props.form.getFieldsValue().code,
            promoCodeStep: false
        });
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
        const {unauthorized, form} = this.props;
        const {getFieldDecorator} = form;
        const {promoCodeStep, loading} = this.state;

        if (promoCodeStep)
            return (
                <Form onSubmit={this.acceptPromo}
                      className="TrialTrainModal">
                    <div className="code">
                        <FormItem>
                            <div className='radio-label'>Укажите промокод</div>
                            {getFieldDecorator('code')(
                                <InputNew width="100%" bubbleplaceholder="Промокод"/>
                            )}
                        </FormItem>
                    </div>
                    <div className="submitPlate">
                        <Button className="saveBtn"
                                btnText='Далее'
                                size='default'
                                type='light-pink'
                        />
                        {loading && <Spinner/>}
                    </div>
                </Form>);
        else return (
            <Form onSubmit={this.handleSubmit}
                  className="TrialTrainModal">
                <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <div className="item">
                    <FormItem>
                        <div className='radio-label'>Выбери дисциплину</div>
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true,
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
                                required: true,
                                message: 'Выберите дни, пожалуйста'
                            }],
                        })(
                            <div className="ant-radio-group">
                                {this.renderTimeSchedule()}
                            </div>
                        )}
                    </FormItem>
                    {unauthorized && <FormItem>
                        <div className='radio-label'>Введите e-mail</div>
                        {getFieldDecorator('email', {
                            rules: [{
                                required: true,
                                message: 'Введите e-mail, пожалуйста'
                            }, {
                                type: "email",
                                message: 'Неправильный формат'
                            }],
                        })(
                            <InputNew width="100%" bubbleplaceholder="E-mail"/>
                        )}
                    </FormItem>}
                </div>
                <div className="submitPlate">
                    <Button className="saveBtn"
                            btnText='Далее'
                            onClick={() => {
                            }}
                            size='default'
                            type='light-pink'
                    />
                    {loading && <Spinner/>}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
