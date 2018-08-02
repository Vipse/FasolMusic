import React from 'react';
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'

import Card from '../Card'
import Button from '../Button'

import './style.css'
import '../../icon/style.css'
import PatientCalendarCarousel from "../PatientCalendarCarousel";
import Radio from "../Radio";
import TextArea from "../TextArea";
import Upload from "../Upload";
import moment from "moment";
import {Form} from "antd";
import {previewFile} from "../../helpers/modifyFiles";


const FormItem = Form.Item;

class DoctorPageNewVisitForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "video",
            timeStamp: null,
            shouldChooseTime: false
        }
    }

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
    getTimeStampFromCarousel = (timeStamp, type) => {
        if(timeStamp) {this.setState({shouldChooseTime: false})}
        this.setState({
            timeStamp,
            type,

        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.state.timeStamp) {
            this.setState({shouldChooseTime: true});
            return
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {
                    type: values.type,
                    timeStamp: this.state.timeStamp
                }

                values.comment ? obj.comment=values.comment : null;

                if(values.file) {
                    obj.file = values.file.fileList.map((item, index) => { return {name: item.name, thumbUrl: item.thumbUrl}})
                }
                this.props.onMakeNewAppointment(obj);
            } else { console.log(err, "ERROR")}

        });
    };
    modifyFiles = (file) => {
        if(!file.thumbUrl && !file.modify){
            file.modify = true;
            previewFile(file.originFileObj, function (previewDataUrl) {
                file.thumbUrl = previewDataUrl;
            });
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}
                  className="DoctorPageNewVisit">
                <div className='doctor-page-new-visit'>
                    <Card title="Записаться на приём">
                        <div className="new-visit-content">
                            <div className="legend">
                                <span className="AppAfterAnalyses">Приёмы по результатам анализов</span>
                                <span className="AppWithVideoAudio">Аудио и видео консультации</span>
                            </div>
                            <PatientCalendarCarousel
                                intervals={
                                    [
                                        {
                                            "intervalOb": [
                                                {
                                                    "start": 1527914040,
                                                    "end": 1527923940
                                                },
                                                {
                                                    "start": 1527925440,
                                                    "end": 1527925800
                                                },
                                                {
                                                    "start": 1527927300,
                                                    "end": 1527930900
                                                },
                                                {
                                                    "start": 1527933900,
                                                    "end": 1527934200
                                                },
                                                {
                                                    "start": 1527935700,
                                                    "end": "1527936240"
                                                }
                                            ],
                                            "date": "1527886800",
                                            "type": "voice"
                                        },
                                        {
                                            "intervalOb": [
                                                {
                                                    "start": "1528970400",
                                                    "end": 1528973100
                                                },
                                                {
                                                    "start": 1528973700,
                                                    "end": 1528975200
                                                },
                                                {
                                                    "start": 1528975800,
                                                    "end": 1528976100
                                                },
                                                {
                                                    "start": 1528976700,
                                                    "end": "1528977600"
                                                }
                                            ],
                                            "date": "1528923600",
                                            "type": "voice"
                                        },
                                        {
                                            "intervalOb": [
                                                {
                                                    "start": 1529582700,
                                                    "end": 1529592600
                                                },
                                                {
                                                    "start": 1529592900,
                                                    "end": "1529593500"
                                                }
                                            ],
                                            "date": "1529528400",
                                            "type": "chat"
                                        },
                                        {
                                            "intervalOb": [
                                                {
                                                    "start": "1530130200",
                                                    "end": 1530130800
                                                },
                                                {
                                                    "start": 1530131100,
                                                    "end": "1530131400"
                                                }
                                            ],
                                            "date": "1530046800",
                                            "type": "chat"
                                        },
                                        {
                                            "intervalOb": [
                                                {
                                                    "start": "1530036300",
                                                    "end": "1530043500"
                                                }
                                            ],
                                            "date": "1530046800",
                                            "type": "chat"
                                        }
                                    ]
                                }
                                makeActive={this.getTimeStampFromCarousel}
                                shouldChooseTime = {this.state.shouldChooseTime}
                            />



                            <FormItem>
                                <div className="typeOfVisit">
                                    <span> Выберите тип связи </span>
                                    {getFieldDecorator('type', {
                                        initialValue: 'chat'
                                    })(
                                             this.getIconsFromType(this.state.type)

                                    )}
                                </div>

                            </FormItem>

                            <FormItem>
                                {getFieldDecorator('comment', {
                                    initialValue: this.state.comment
                                })(
                                    <TextArea label='Комментарий к приему'
                                              className="NewVisitModal-txtarea"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('file')(
                                        <Upload className="newVisitDocPageeModal-upload"
                                                onChange={({file}) => this.modifyFiles(file)}
                                                listType='text'
                                                text="Прикрепить результаты исследований"/>
                                )}
                            </FormItem>
                            <Button size='default'
                                    btnText={`Записаться ${this.state.timeStamp ? `на ${moment(this.state.timeStamp*1000).format("D MMMM H:mm")}`:``}`}
                                    htmlType="submit"
                                    type='float'/>
                        </div>
                    </Card>
                </div>
            </Form>
        )
    }
}

const DoctorPageNewVisit = Form.create()(DoctorPageNewVisitForm);


export default DoctorPageNewVisit