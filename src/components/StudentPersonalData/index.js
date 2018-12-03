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
import PersonalDataSkill from "../PersonalDataSkill";
import PersonalDataPreferences from "../PersonalDataPreferences";
import PersonalDataTime from "../PersonalDataTime";
import moment from "moment";

class StudentPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            avatarLink: "",
            facebookLink: "",
            googleLink: "",
            trainingTime: {
                enabledDays: [],
                selectedTimes: []
            }
        }
    }

    componentDidMount() {
        this.setState({
            avatarLink: this.props.profileStudent.avatar,
            facebookLink: this.props.profileStudent.facebooklink,
            googleLink: this.props.profileStudent.googlelink,
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
        return JSON.stringify(preparedTrainingTime) !== '{}' ? preparedTrainingTime : this.props.profileStudent.trainingtime;
    };

    prepareDisciplines = (data) => {
        let preparedDisciplines = [];
        for (let i = 0; i < 2; ++i) {
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
            if (!err && this.props.profileStudent.id) {

                const finalData = {
                    id: this.props.profileStudent.id,
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
        const rootClass = cn('student-data');
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.profileStudent);
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"student-data-form"}>
                        <div className='student-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={this.props.profileStudent}
                            updateLink={this.updateLink}
                            getFieldDecorator={getFieldDecorator}
                        />
                        <div className='student-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Уровень подготовки гитара</div>
                        <PersonalDataSkill
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            number={0}
                        />
                        {this.props.profileStudent.disciplines.length > 1 &&
                        <div className='student-data-title'>Уровень подготовки вокал</div>}
                        {this.props.profileStudent.disciplines.length > 1 && <PersonalDataSkill
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            number={1}
                        />}
                        <div className='student-data-title'>Идеальный тренер</div>
                        <PersonalDataPreferences
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Удобное время тренировок</div>
                        <PersonalDataTime
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.updateTrainingTime}
                        />
                    </Form>

                    <Button
                        className="student-data-saveBtn"
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

const StudentPersonalData  = Form.create()(StudentPersonalDataForm);

StudentPersonalData.propTypes = {
    profileStudent: PropTypes.object,
    onSubmit: PropTypes.func
};

StudentPersonalData.defaultProps = {
    profileStudent: {},
    onSubmit: () => {}
};

export default StudentPersonalData
