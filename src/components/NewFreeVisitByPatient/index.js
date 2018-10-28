import React from 'react';

import Card from '../Card'
import Button from '../Button'

import './style.css'
import '../../icon/style.css'
import PatientCalendarCarousel from "../PatientCalendarCarousel";
import Radio from "../Radio";
import TextArea from "../TextArea";
import Upload from "../Upload";
import moment from "moment";
import {Form, message} from "antd";
import {previewFile} from "../../helpers/modifyFiles";
import Select from "../Select";

import Modal from "../Modal";
import Spinner from "../Spinner";

const FormItem = Form.Item;

class NewFreeVisitByPatientForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "video",
            timeStamp: null,
            shouldChooseTime: false,
            isCarouselLoading: false,
            isCarouselVisible: false,
            showSubmitError: false,
            isTypeVisible: false,
            isSubmitInProgress: false,
            currentSpeciality: "",
            docs: []
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

    getTimeStampFromCarousel = (timeStamp, type, docs) => {
        if(timeStamp) {this.setState({shouldChooseTime: false, isTypeVisible: true})}
        this.setState({
            timeStamp,
            type,
            docs: docs ? docs.split(" ") : null,
            showSubmitError: false
        })
    };
    componentWillReceiveProps(nextProps){
        nextProps.visible === true && this.props.visible===false ? (this.setState({
            type: 'video',  timeStamp: null,
            shouldChooseTime: false,
            isCarouselLoading: false,
            isCarouselVisible: false,
            isTypeVisible: false,
            showSubmitError: false,
            currentSpeciality: "",
            isSubmitInProgress: false,
            comment:""
        }),
            this.props.form.resetFields()) : null;
    }
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
                    date: this.state.timeStamp,
                    free: "1"
                };

                if(this.state.docs.length) {

                    let rand = Math.floor(Math.random() * this.state.docs.length);
                    obj.id_doc = this.state.docs[rand];
                }

                values.comment ? obj.comment=values.comment : null;

                if(values.file) {
                    obj.file = values.file.fileList.map((item, index) => { return {name: item.name, thumbUrl: item.originFileObj.thumbUrl}})
                }

                this.setState({isSubmitInProgress: true});
                this.props.onMakeFreeVisit(obj).then((res) => {
                        if (res.data.code === 200) {
                            message.success('Заявка отправлена');
                            this.props.onCancel();
                            this.setState({
                                showSubmitError: false,
                                isSubmitInProgress: false
                            });
                        }
                        else if (res.data.code === 701) {
                            this.setState({
                                showSubmitError: true,
                                isSubmitInProgress: false
                            });
                            this.handleSelectChange(this.state.currentSpeciality);
                        }
                        else {
                            this.setState({
                                isSubmitInProgress: false
                            });
                            message.error('Произошла ошибка при отправке заявки');
                        }
                    }
                )
            } else { console.log(err, "ERROR")}

        });
    };
    modifyFiles = (file) => {
        if(!file.thumbUrl && !file.modify){
            file.modify = true;
            previewFile(file, function (previewDataUrl) {
                file.thumbUrl = previewDataUrl;
            });
        }
    };
    refactorIntervals = (intervals) => {
        if(typeof intervals === "object" && intervals !==null) {
            let array = [];
            for(let key in intervals) {
                array.push({[key]: intervals[key]})
            };
            return array;
        }
    }
    renderOptions = () => {
        return this.props.docTypes.map((docType, i) => {
            return (
                <Select.Option value={docType}
                               key={`my_patient_${i}`}>
                    {docType}</Select.Option>)
        })
    };
    handleSelectChange = (speciality) => {
        this.setState({isCarouselLoading: true});
        this.props.getFreeVisitIntervals(speciality)
            .then((res) => {
                if (res.data.code === 200)
                    this.setState({
                        isCarouselLoading: false,
                        isCarouselVisible: true
                    })
            });
    };
    onCancel = () => {

        this.props.onCancel();
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible} = this.props;

        return (
            <Modal visible={visible}
                   onCancel={this.onCancel}
            >
                <div className='patient-page-new-free-visit'>
                    <Card>
                        <div className="new-visit-content">
                            <span className="chose-doc-type">Выберете категорию врача</span>
                            <FormItem>
                                {getFieldDecorator('docType',{
                                    rules: [{
                                        required: true,
                                        message: 'Выберете тип доктора'
                                    }]
                                })(
                                    <Select placeholder="Категория врача"
                                            onChange={(spec) => {
                                                this.setState({
                                                    currentSpeciality: spec,
                                                    showSubmitError: false
                                                });
                                                this.handleSelectChange(spec);
                                            }}

                                    >
                                        {this.renderOptions()}
                                    </Select>
                                )}
                            </FormItem>

                            {this.state.isCarouselLoading ? <Spinner/> : this.state.isCarouselVisible ?
                                <PatientCalendarCarousel
                                    intervals = {this.refactorIntervals(this.props.freeVisitsIntervals)}
                                    makeActive={this.getTimeStampFromCarousel}
                                    shouldChooseTime = {this.state.shouldChooseTime}
                                    isOnFreeAppointments = {true}
                                /> : null}
                            {this.state.isTypeVisible && <FormItem>
                                <div className="typeOfVisit">
                                    <div className="chose-visit-type"> Выберите тип связи </div>
                                    {getFieldDecorator('type', {
                                        initialValue: 'chat'
                                    })(
                                        this.getIconsFromType(this.state.type)

                                    )}
                                </div>

                            </FormItem>}
                            <div className="textarea-label">Комментарий</div>
                            <FormItem>
                                {getFieldDecorator('comment', {
                                    initialValue: this.state.comment
                                })(
                                    <textarea className="textarea-field"
                                              onChange={this.handleChange}
                                    />
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
                            <div className="new-visit-content-submit">
                                <Button size='default'
                                        btnText={`Записаться ${this.state.timeStamp ? `на ${moment(this.state.timeStamp*1000).format("D MMMM H:mm")}`:``}`}
                                        disable={this.state.isSubmitInProgress}
                                        htmlType="submit"
                                        type='float'
                                        onClick={this.handleSubmit}

                                />
                                {this.state.isSubmitInProgress && <div className="new-visit-content-submit-spinner"><Spinner/></div>}
                            </div>
                            {this.state.showSubmitError && <div className="new-visit-content-error">Данное время уже занято</div>}
                        </div>
                    </Card>
                </div>
            </Modal>
        )
    }
}

const NewFreeVisitByPatient = Form.create()(NewFreeVisitByPatientForm);


export default NewFreeVisitByPatient
