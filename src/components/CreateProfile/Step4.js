import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import Hoc from '../Hoc'
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import {Form} from "antd";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import Slider from "antd/es/slider";

const FormItem = Form.Item;

class Step4Form extends React.Component{
    constructor(props){
        super(props);
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // if (!err) {
            //
            //     let fields = {
            //         ...values,
            //         avatarThumb: this.state.avatarThumb ? this.state.avatarThumb : this.props.data.avatarThumb
            //     };
            //     if(!values.avatar.url && !values.avatar.name) {
            //         fields.avatar = {name: this.state.avatarName, url: this.state.avatarUrl};
            //     }
            let selectedTimesObj = {};
            this.state.selectedTimes.forEach((item, i) => this.state.enabledDays[i] ? selectedTimesObj[i] = item : null);
            console.log("FINAL REG DATA", {
                ...this.props.data,
                daysCount: values.daysCount,
                selectedTimes: selectedTimesObj
            });
            //this.props.onSubmit(values);
            this.props.onNext();
            // }
        })
    };

    renderTimeSchedule = () => {
        let timeScheduleArr = [];
        let daysName = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        for (let i = 0; i < 7; i++)
            timeScheduleArr.push(<div className="timeSchedule">
                <Checkbox className="dayCheckbox" value={i} checked={this.state.enabledDays[i]} onChange={() => this.handleActiveSlider(i)}
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
                        <div className='radio-label'>Количество дней в неделю:</div>
                            {getFieldDecorator('daysCount', {
                                rules: [{ required: true,
                                    message: 'Выберите количество дней, пожалуйста' }],
                            })(
                                <div className="ant-radio-group">
                                <RadioGroup style={{display: "flex", flexDirection: "column"}}>
                                    <Radio value='1' key='radio-1'>1</Radio>
                                    <Radio value='2' key='radio-2'>2</Radio>
                                    <Radio value='3' key='radio-3'>3</Radio>
                                    <Radio value='4' key='radio-4'>4</Radio>
                                    <Radio value='5' key='radio-5'>5</Radio>
                                    <Radio value='5+' key='radio-5+'>5 и более</Radio>
                                </RadioGroup>
                                </div>
                            )}
                    </FormItem>
                    <FormItem>
                        <div className='radio-label'>Время:</div>
                            {getFieldDecorator('timeSchedule', {
                                rules: [{ required: true,
                                    message: 'Выберите время, пожалуйста' }],
                            })(
                                <div className="ant-radio-group">
                                    {this.renderTimeSchedule()}
                                </div>
                            )}
                    </FormItem>
                </div>

                <div className="steps-action">
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
