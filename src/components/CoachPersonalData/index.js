import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button';
import PersonalDataContact from '../PersonalDataContact';
import PersonalDataInfo from "../PersonalDataInfo";
import CoachPersonalDataPromo from "../CoachPersonalDataPromo";
//import CoachPersonalDataPayment from "../CoachPersonalDataPayment";
import PersonalDataSkill from "../PersonalDataSkill";
import PersonalDataPreferences from "../PersonalDataPreferences";
import PersonalDataTime from "../PersonalDataTime";
import ChangePasswordModal from "../ChangePasswordModal";
import SendSuggestionsModal from "../SendSuggestionsModal";

import './style.css'
import '../../icon/style.css'

import Card from "antd/es/card";
import {Form, message} from "antd";
import Spinner from "../Spinner";
import moment from "moment";

class CoachPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatar: "",
            promoLink: "",
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([10, 23])
            },
            isChangePasswordModalVisible: false,
            isSendSuggestionsModalVisible: false
        }
    }

    componentDidMount() {
        const { avatar, facebooklink, googlelink, promovideo } = this.props.profileCoach;
        this.setState({
            avatar: avatar,
            promoLink: promovideo
        });
        this.loadTrainingTime();
    }

    loadTrainingTime = () => {
        const { trainingtime } = this.props.profileCoach;
        for (let num in trainingtime) {
            this.handleChangeTrainingTime('enabledDays', num, true);
            this.handleChangeTrainingTime('selectedTimes', num, [
                trainingtime[num].datestart,
                trainingtime[num].dateend
            ]);
        }
    };

    handleChangeAvatar = (newAvatar) => {
        this.setState({avatar: newAvatar});
    };

    handleChangeSocial = (name, valuesObj) => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        const {avatar} = this.state;

        const updateData = {
            id: this.props.profileCoach.id,
            [name + 'link']: valuesObj.link
        };

        const checkableFields = ['name', 'email'];
        checkableFields.forEach(item => {
            if (!getFieldValue(item) && valuesObj[item]) {
                setFieldsValue({[item]: valuesObj[item]});
                updateData[item] = valuesObj[item];
            }
        });

        if (!avatar && valuesObj.avatar) {
            this.handleChangeAvatar(valuesObj.avatar);
            updateData.avatar = valuesObj.avatar;
        }

        return this.props.onSubmit(updateData);
    };

    handleChangeTrainingTime = (type, num, value) => {
        const {trainingTime} = this.state;
        let newArray = trainingTime[type];
        newArray[num] = value;
        this.setState({
            trainingTime: {
                ...trainingTime,
                [type]: newArray
            }
        });
    };

    prepareDisciplines = (data) => {
        let disciplinesNumsArr = [];
        for (let key in data)
            if (key.indexOf('discipline-') !== -1) disciplinesNumsArr.push(+key.slice(11));

        let preparedDisciplines = [];
        disciplinesNumsArr.forEach((i) => {
            preparedDisciplines.push({
                discipline: data["discipline-" + i],
                specialization: data["specialization-" + i],
                level: data["level-" + i],
                experience: data["experience-" + i],
                goals: data["goals-" + i],
                musicstyles: data["musicstyles-" + i],
                favoritesingers: data["favoritesingers-" + i]
            });
        });

        return preparedDisciplines;
    };

    prepareTrainingTime = () => {
        let preparedTrainingTime = {};
        for (let i = 0; i < 7; ++i) {
            this.state.trainingTime.enabledDays[i] ? preparedTrainingTime[i] = {
                datestart: this.state.trainingTime.selectedTimes[i][0],
                dateend: this.state.trainingTime.selectedTimes[i][1]
            } : null;
        }
        return JSON.stringify(preparedTrainingTime) !== '{}' ? preparedTrainingTime : this.props.profileCoach.trainingtime;
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.profileCoach.id) {

                const finalData = {
                    id: this.props.profileCoach.id,
                    name: values.name,
                    phones: values.phones.split(' ').join('').split(',', 2),
                    email: values.email,
                    country: values.country,
                    avatar: this.state.avatar,

                    sex: values.sex === "Мужской" ? "m" : "w",
                    datebirth: moment(values.datebirth).format('X'),
                    work: values.work,
                    interests: values.interests,
                    aboutme: values.aboutme,

                    promovideo: this.state.promoLink,

                    disciplines: this.prepareDisciplines(values),

                    bestsex: values.bestsex === "Мужской" ? "m" : "w",
                    bestage: values.bestage,
                    bestishomework: values.bestishomework === "Да",
                    bestqualities: values.bestqualities,
                    bestcomment: values.bestcomment,

                    trainingtime: this.prepareTrainingTime()
                };

                this.setState({uploadingNewData: true});
                this.props.onSubmit(finalData)
                    .then((res) => {
                    this.setState({uploadingNewData: false});
                    if (res && !res.data.error) {
                        message.success("Изменения сохранены");
                    } else
                        message.error("Произошла ошибка, попробуйте ещё раз");
                });
            }
            else
                console.log("error", err);
        })
    };

    render() {
        const rootClass = cn('coach-data');
        const { promoLink } = this.state;
        const { form, profileCoach } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"coach-data-form"}>
                        <div className='coach-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileCoach}
                            onChangeAvatar={this.handleChangeAvatar}
                            onChangeSocial={this.handleChangeSocial}
                            getFieldDecorator={getFieldDecorator}
                            showChangePasswordModal={() => this.setState({isChangePasswordModalVisible: true})}
                            showSendSuggestionsModal={() => this.setState({isSendSuggestionsModalVisible: true})}
                        />
                        <div className='coach-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Проморолик</div>
                        <CoachPersonalDataPromo
                            promoLink={promoLink}
                        />
                        {/*<div className='coach-data-title'>Платежные данные</div>
                        <CoachPersonalDataPayment
                            profileCoach={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />*/}
                        <div className='coach-data-title'>Уровени подготовки по дисциплинам</div>
                        <PersonalDataSkill
                            profile={profileCoach}
                            form={form}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Идеальный студент</div>
                        <PersonalDataPreferences
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Удобное время проведения тренировок</div>
                        <PersonalDataTime
                            trainingTime={this.state.trainingTime}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.handleChangeTrainingTime}
                        />

                        <Button
                            className="coach-data-saveBtn"
                            onClick={this.handleSubmitInfo}
                            btnText='Сохранить изменения'
                            size='default'
                            disable={this.state.uploadingNewData}
                            type='light-blue'
                            style={{marginRight: "20px"}}
                        />

                        {this.state.uploadingNewData && <Spinner isInline={true} size="small"/>}
                    </Form>

                    <ChangePasswordModal
                        profile={profileCoach}
                        visible={this.state.isChangePasswordModalVisible}
                        onSubmit = {this.props.onSubmit}
                        onCancel={() => this.setState({isChangePasswordModalVisible: false})}
                    />
                    <SendSuggestionsModal
                        profile={profileCoach}
                        visible={this.state.isSendSuggestionsModalVisible}
                        onSubmit = {this.props.onSubmit}
                        onCancel={() => this.setState({isSendSuggestionsModalVisible: false})}
                    />
                </Card>
            </div>
        )
    }
}

const CoachPersonalData  = Form.create()(CoachPersonalDataForm);

CoachPersonalData.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalData.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default CoachPersonalData
