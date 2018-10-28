import React from 'react';
import moment from 'moment'
import {Form, Alert} from 'antd';
import TextArea from '../TextArea'
import Button from '../Button'
import Radio from '../Radio'
import Input from '../Input'
import Icon from '../Icon'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import {previewFile} from "../../helpers/modifyFiles";
import Upload from "../Upload";
import {message} from 'antd';
import Spinner from "../Spinner";

const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: null,
            message: '',
            currentTime: moment(),
            isResetTime: false,
            type: "chat",
            appointmentDuration: 5,
            currentDate: moment(+new Date()),
            showSubmitError: false,
            loading: false
        };
    };

    onChangeTime = (start) => {
        let paramDate = moment(+this.state.currentTime.format('x'));
        let type;
        let area = this.state.availableArea;
        paramDate.hour(start._d.getHours());
        paramDate.minute(start._d.getMinutes());
        paramDate.second(0);

        for (let i = 0; i < area.length; i++) {
            if (paramDate.hour() >= area[i].from.hour() && paramDate.hour() <= area[i].to.hour()) {
                type = area[i].type;
            }
        }

        this.setState({
            currentTime: paramDate,
            type: type,
            isResetTime: false,
            showSubmitError: false
        });
    };

    onChangeDate = (dateParam) => {
        let date = (dateParam ? dateParam : this.state.currentDate);

        let paramDate = moment(+this.state.currentTime.format('x'));
        const bufHours = paramDate._d.getHours();
        const bufMinutes = paramDate._d.getMinutes();

        paramDate = date;
        paramDate.hour(bufHours);
        paramDate.minute(bufMinutes);
        paramDate.second(0);
        this.setState({
            currentTime: paramDate,
            isResetTime: true,
            showSubmitError: false,
            currentDate: date
        });
        this.getAppointmentDuration(date);

        let beginDay = moment(date).startOf('date').format('X'),
            endDay = moment(date).endOf('date').format('X');
        this.props.onChangeDate(beginDay, endDay, this.props.id);
    };

    getIntervals = (newIntervals) => {
        let intervals = [];

        const arr = newIntervals;
        for (let i = 0; arr && i < arr.length; i++) {
            for (let j = 0; j < arr[i].intervalOb.length; j++) {
                if (+arr[i].intervalOb[j].start < +moment().format("X") + 1800) {
                    if (+arr[i].intervalOb[j].end > +moment().format("X") + 1800) {
                        intervals.push({
                            from: (+moment().format("X") + 1800) * 1000,
                            to: (+arr[i].intervalOb[j].end) * 1000,
                            type: (arr[i].type)
                        });
                    }
                } else {
                    intervals.push({
                        from: (+arr[i].intervalOb[j].start) * 1000,
                        to: (+arr[i].intervalOb[j].end) * 1000,
                        type: (arr[i].type)
                    });
                }
            }
        }
        return intervals;
    };

    isDayDisabled = (current) => {
        return current && this.props.availableIntervals.every(
            (elem) => moment(elem.date * 1000).format("YYYY-MM-DD")
                !== moment(current).format("YYYY-MM-DD"));
    };

    getAppointmentDuration = (day) => {
        for (let i = 0; i < this.props.availableIntervals.length; i++) {
            if ((this.props.availableIntervals[i].date * 1000) === parseInt(day.startOf('day').format('x'))) {
                this.setState({appointmentDuration: parseInt(this.props.availableIntervals[i].interval)});
                break;
            }
        }
    };

    getIconsFromType = (type) => {
        let icons;
        switch (type) {
            case "chat":
                icons = <Radio icons={['chat1']}/>;
                break;
            case "voice":
                icons = <Radio icons={['chat1', 'telephone']}/>;
                break;
            case "video":
                icons = <Radio icons={['chat1', 'telephone', "video-camera"]}/>;
                break;
            default:
                icons = <Radio icons={['chat1']}/>;
        }
        return icons;
    };

    componentWillReceiveProps(nextProps) {
        (nextProps.visible && !this.props.visible) ? (this.setState({
            message: '',
            isResetTime: true,
            showSubmitError: false,
        }),
            this.props.form.resetFields()) : null;

        nextProps.intervals !== this.props.intervals ?
            this.setState({availableArea: this.getIntervals(nextProps.intervals)}) : null;


        if (!nextProps.submitSuccess && nextProps.submitSuccess !== this.props.submitSuccess) {
            this.onChangeDate();
            this.setState({showSubmitError: true});
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let paramDate = this.state.currentTime;
                let response = {
                    id_user: this.props.id,
                    comment: this.state.message,
                    date: +paramDate.format('X'), //формат для сервера
                    type: values.radio,
                };
                if (values.file) {
                    response.file = values.file.fileList.map((item, index) => {
                        return item.originFileObj
                    })
                }

                this.setState({loading: true});
                this.props.onSave(response)
                    .then((res) => {
                        res.data.code === 200
                            ? (message.success("Запись прошла успешно"), this.props.onCancel())
                            : message.error("Произошла ошибка, выберете другое время")
                        this.setState({loading: false})
                    });
            } else {
                console.log(err, "ERROR")
            }
        });

    };

    modifyFiles = (file) => {
        if (!file.thumbUrl && !file.modify) {
            file.modify = true;
            previewFile(file, function (previewDataUrl) {
                file.thumbUrl = previewDataUrl;
            });
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible, date, time, userName, defaultDate} = this.props;

        return (
            <Form onSubmit={this.handleSubmit}
                  className="NewVisitModal">
                <Input addonBefore="ФИО" value={userName} readOnly/>

                <div className='flex-row'>
                    <FormItem>
                        {getFieldDecorator('day', {
                            rules: [{required: true, message: 'Введите дату',}],
                        })(
                            <DatePicker placeholder="Дата приёма"
                                        onChange={this.onChangeDate}
                                        disabledDate={this.isDayDisabled}
                            />
                        )}
                    </FormItem>

                    <FormItem>
                        {getFieldDecorator('time', {
                            rules: [{required: true, message: 'Введите время',}],
                        })(
                            <TimePicker format="HH:mm"
                                        minuteStep={this.state.appointmentDuration}
                                        availableArea={this.state.availableArea}
                                        placeholder='Время приёма'
                                        isReset={this.state.isResetTime}
                                        onChange={this.onChangeTime}/>
                        )}
                    </FormItem>

                </div>


                <TextArea label='Комментарий'
                          value={this.state.message}
                          onChange={message => this.setState({message})}
                          className="NewVisitModal-txtarea"/>
                {this.props.isUser && <FormItem>
                    {getFieldDecorator('file')(
                        <Upload className="newMessageModal-upload"
                                onChange={({file}) => this.modifyFiles(file)}
                                listType='text'
                                text="Прикрепить результаты исследований"/>
                    )}
                </FormItem>}

                <FormItem>
                    {getFieldDecorator('radio', {
                        initialValue: 'chat',
                    })(
                        this.getIconsFromType(this.state.type)
                    )}
                </FormItem>

                <div className='NewVisitModal-submit'>
                    <Button size='default'
                            btnText='Сохранить'
                            disable={this.state.loading}
                            htmlType="submit"
                            type='float'
                            style={{marginRight: "20px"}}

                    />
                    {this.state.loading && <Spinner inline={true} size="small"/>}

                    {this.state.showSubmitError &&
                    <div className='NewVisitModal-submit-error'>Это время уже занято</div>}
                </div>

            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
