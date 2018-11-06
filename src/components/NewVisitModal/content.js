import React from 'react';
import moment from 'moment'

import {Form, message} from 'antd';
import TextArea from '../TextArea'
import Button from '../Button'
import Radio from '../Radio'
import Select from '../Select'
import Icon from '../Icon'
import TimePicker from '../TimePicker'
import Spinner from "../Spinner";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        time: moment(+new Date()).startOf('day'),
        isResetTime: false,
        availableArea: []
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true});
                let newDate = new Date();

                let response = this.props.isChoosebleTime ? (
                    newDate.setHours(values.time.format('HH')),
                    newDate.setMinutes(values.time.format('mm')),
                    {
                        ...this.props.form.getFieldsValue(),
                        comment: this.state.message,
                        date: Math.floor((newDate).getTime()/1000),
                    }
                ):(
                    {
                        ...this.props.form.getFieldsValue(),
                        comment: this.state.message,
                        date: Math.floor((this.props.date).getTime()/1000),
                    }
                );
                this.props.onSave(response).then((res)=> {
                    res.data.code === 200
                        ? (message.success("Запись прошла успешно"), this.props.onCancel())
                        : message.error("Произошла ошибка, выберете другое время");
                    this.setState({loading:false})
                });
            }
          });
    };

    componentWillMount() {
        this.setState({availableArea: this.getIntervals(this.props.intervals)});
    }

    componentWillReceiveProps(nextProps){
        this.props.visible !== nextProps.visible && nextProps.visible === true ? (
            this.setState({message: '', isResetTime: true,
                availableArea: this.getIntervals(nextProps.intervals)}),
            this.props.form.resetFields()
        ) : null;

        if (this.props.intervals !== nextProps.intervals){
            this.setState({
                availableArea: this.getIntervals(nextProps.intervals)});
        };
    };

    onChangeTime = (start) => {
        let selectedTime = this.state.time;
        selectedTime.hour(start._d.getHours());
        selectedTime.minute(start._d.getMinutes());
        selectedTime.second(0);

        this.setState({
            time: selectedTime,
            isResetTime: false
        });
    };

    getAppointmentDuration = () => {
        for (let i = 0; i < this.props.intervals.length; i++)
            if (this.props.intervals[i].interval)
                return parseInt(this.props.intervals[i].interval);
    };

    getIntervals = (newIntervals) => {
        let intervals = [];

        const arr = newIntervals;
        for(let i = 0; arr && i < arr.length; i++){
            for(let j = 0; j < arr[i].intervalOb.length; j++){
                if(+arr[i].intervalOb[j].start < +moment().format("X")+1800) {
                    if(+arr[i].intervalOb[j].end >  +moment().format("X")+1800) {
                        intervals.push({from: (+moment().format("X")+1800)*1000, to: (+arr[i].intervalOb[j].end) * 1000, type: (arr[i].type)});
                    }
                } else {
                    intervals.push({from: (+arr[i].intervalOb[j].start)*1000, to: (+arr[i].intervalOb[j].end)*1000, type: (arr[i].type)});
                }
            }
        }

        return intervals;
    };

    renderOptions = () => {
        return this.props.patients.length && this.props.patients.map((patient, i) => {
            return (
                <Select.Option value={patient.id}
                               key={`my_patient_${i}`}>
                    {patient.name}</Select.Option>)
        })
    };

    getType = () => {
        let type = this.props.intervals[0] && this.props.intervals[0].type || "video";
        switch (type) {
            case "video":
                return ['chat1','telephone', "video-camera"];
            case "voice":
                return ['chat1','telephone'];
            default:
                return ['chat1']

        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible, date} = this.props;
        const icons = this.getType();
        let timeElement = this.props.isChoosebleTime 
            ? <div className='modal-time'>
                <FormItem>
                    {getFieldDecorator('time',{
                        rules: [{required: true, message: 'Введите время',}],
                    })(
                        <TimePicker format="HH:mm"
                            placeholder='Время приёма'
                            availableArea={this.state.availableArea}
                            minuteStep={this.getAppointmentDuration()}
                            isReset={this.state.isResetTime}
                            onChange={this.onChangeTime}/>
                    )}
                </FormItem>
            </div>
            : <div className='modal-time'>
                <Icon svg type='alarm' size={26}/>
                <div className='modal-result'>{moment(date).format('HH:mm')}</div>
            </div>;

        return (
            <Form onSubmit={this.handleSubmit}
                  className="NewVisitModal">


                <div className='modal-row'>
                    <div className='modal-data'>
                        <Icon svg type='calendar' size={26}/>
                        <div className='modal-result'>{moment(date).format('DD MMMM')}</div>
                    </div>
                    {timeElement}
                </div>

                {!this.props.patients.length ?
                    <FormItem className="user-select"
                        validateStatus='error'
                              help="Добавьте пациентов в свой список"
                    >
                        {getFieldDecorator('id_user', {
                            rules: [{required: true, message: 'Выберите пациента',}],
                        })(
                            <Select placeholder="ФИО">
                                {this.renderOptions()}
                            </Select>
                        )}
                    </FormItem> :
                <FormItem className="user-select"

                >
                        {getFieldDecorator('id_user', {
                            rules: [{required: true, message: 'Выберите пациента',}],
                        })(
                            <Select placeholder="ФИО">
                                {this.renderOptions()}
                            </Select>
                        )}
                </FormItem>}
                
                <TextArea label='Комментарий к приему'
                            value={this.state.message}
                            onChange={message => this.setState({message})}
                          className="NewVisitModal-txtarea"/>
                

                <FormItem>
                    {getFieldDecorator('type', {
                        initialValue: 'chat'
                    })(
                        <Radio icons={icons}/>
                    )}
                </FormItem>

                <Button size='default'
                        btnText='Сохранить'
                        htmlType="submit"
                        type='float'
                        style={{marginRight: "20px"}}
                        disable={this.state.loading}

                />
                 {this.state.loading && <Spinner isInline={true} size="small"/>}
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
