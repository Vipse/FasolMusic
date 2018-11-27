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
            avatarLink: "",
            facebookLink: "",
            googleLink: "",
            promoLink: "",
            trainingTime: {
                enabledDays: [],
                selectedTimes: []
            }
        }
    }

    componentDidMount() {
        this.setState({
            avatarLink: this.props.profileCoach.avatar,
            facebookLink: this.props.profileCoach.facebooklink,
            googleLink: this.props.profileCoach.googlelink,
            promoLink: this.props.profileCoach.promovideo,
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([10, 23])
            }
        })
    }

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
                    //facebooklink: this.state.facebookLink,
                    //googlelink: this.state.googleLink,

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

                    trainingtime: this.prepareTrainingTime(),

                    password: "123456"
                };

                this.setState({loading: true});
                this.props.onSubmit(finalData);
            }
            else console.log("error", err);
        })
    };

    render() {
        const rootClass = cn('coach-data');
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"coach-data-form"}>
                        <div className='coach-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={this.props.profileCoach}
                            updateLink={this.updateLink}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Проморолик</div>
                        <CoachPersonalDataPromo
                            profileCoach={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Платежные данные</div>
                        <CoachPersonalDataPayment
                            profileCoach={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Уровень подготовки по дисциплине</div>
                        <PersonalDataSkill
                            profile={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            number={0}
                        />
                        <div className='coach-data-title'>Идеальный студент</div>
                        <PersonalDataPreferences
                            profile={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='coach-data-title'>Удобное время проведения тренировок</div>
                        <PersonalDataTime
                            profile={this.props.profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.updateTrainingTime}
                        />
                    </Form>

                    <Button
                        className="coach-data-saveBtn"
                        onClick={this.handleSubmitInfo}
                        btnText='Сохранить изменения'
                        size='default'
                        disable={this.state.loadingInfo}
                        type='float'
                        style={{marginRight: "20px"}}
                    />

                    {this.state.loadingInfo && <Spinner isInline={true} size="small"/>}
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
