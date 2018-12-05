import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import PersonalDataContact from '../PersonalDataContact'
import PersonalDataInfo from "../PersonalDataInfo";
import CoachPersonalDataPromo from "../CoachPersonalDataPromo";

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import {Form, message} from "antd";
import Spinner from "../Spinner";
import CoachPersonalDataPayment from "../CoachPersonalDataPayment";
import PersonalDataSkill from "../PersonalDataSkill";
import PersonalDataPreferences from "../PersonalDataPreferences";
import PersonalDataTime from "../PersonalDataTime";
import moment from "moment";

class CoachPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatarLink: "",
            facebookAuth: {link: '', name: '', email: ''},
            googleAuth: {link: '', name: '', email: ''},
            promoLink: "",
            trainingTime: {
                enabledDays: [],
                selectedTimes: []
            }
        }
    }

    componentDidMount() {
        this.setState({
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([10, 23])
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.profileCoach.id !== nextProps.profileCoach.id)
            this.setState({
                avatarLink: nextProps.profileCoach.avatar,
                facebookAuth: {link: nextProps.profileCoach.facebooklink, name: '', email: ''},
                googleAuth: {link: nextProps.profileCoach.googlelink, name: '', email: ''},
                promoLink: nextProps.profileCoach.promovideo,
            })
    }

    handleChangeSocial = (valueObj) => {
        const {getFieldValue, setFieldsValue} = this.props.form;
        const { name } = valueObj[Object.keys(valueObj)[0]];
        this.setState(valueObj);
        if (!getFieldValue('name') && name)
            setFieldsValue({name: name});
    };

    updateLink = (type, link) => {
        this.setState({[type + "Link"]: link})
    };

    updateTrainingTime = (type, value) => {
        this.setState({trainingTime: {
                ...this.state.trainingTime,
                [type]: value
            }});
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

    prepareDisciplines = (data) => {
        let preparedDisciplines = [];
        for (let i = 0; i < 1; ++i) {
            preparedDisciplines.push({
                discipline: data["discipline-" + i],
                specialization: data["specialization-" + i],
                level: data["level-" + i],
                experience: data["experience-" + i],
                goals: data["goals-" + i],
                musicstyles: data["musicstyles-" + i],
                favoritesingers: data["favoritesingers-" + i]
            });
        }
        return preparedDisciplines;
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
                    //avatar: this.state.avatarLink,
                    facebooklink: this.state.facebookAuth.link,
                    googlelink: this.state.googleAuth.link,

                    sex: values.sex === "Мужской" ? "m" : "w",
                    datebirth: moment(values.datebirth).format('X'),
                    work: values.work,
                    interests: values.interests,
                    aboutme: values.aboutme,

                    //promovideo: this.state.promoLink,

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
                    if (!res.data.error) {
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
        const { facebookAuth, googleAuth } = this.state;
        const { form, profileCoach } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"coach-data-form"}>
                        <div className='coach-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileCoach}
                            updateLink={this.updateLink}
                            form={form}
                            onChangeSocial={this.handleChangeSocial}
                            facebookAuth={facebookAuth}
                            googleAuth={googleAuth}
                        />
                        <div className='coach-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Проморолик</div>
                        <CoachPersonalDataPromo
                            profileCoach={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Платежные данные</div>
                        <CoachPersonalDataPayment
                            profileCoach={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Уровень подготовки по дисциплине</div>
                        <PersonalDataSkill
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            number={0}
                        />
                        <div className='coach-data-title'>Идеальный студент</div>
                        <PersonalDataPreferences
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Удобное время проведения тренировок</div>
                        <PersonalDataTime
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.updateTrainingTime}
                        />
                    </Form>

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
