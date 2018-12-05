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
            uploadingNewData: false,
            avatarLink: "",
            facebookAuth: {link: '', name: '', email: ''},
            googleAuth: {link: '', name: '', email: ''},
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
        if (this.props.profileStudent.id !== nextProps.profileStudent.id) {
            this.setState({
                avatarLink: nextProps.profileStudent.avatar,
                facebookAuth: {link: nextProps.profileStudent.facebooklink, name: '', email: ''},
                googleAuth: {link: nextProps.profileStudent.googlelink, name: '', email: ''}
            })
        }
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
                    facebooklink: this.state.facebookAuth.link,
                    googlelink: this.state.googleAuth.link,

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
        const rootClass = cn('student-data');
        const { facebookAuth, googleAuth } = this.state;
        const { form, profileStudent } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"student-data-form"}>
                        <div className='student-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileStudent}
                            updateLink={this.updateLink}
                            form={form}
                            onChangeSocial={this.handleChangeSocial}
                            facebookAuth={facebookAuth}
                            googleAuth={googleAuth}
                        />
                        <div className='student-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Уровень подготовки гитара</div>
                        <PersonalDataSkill
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            number={0}
                        />
                        {profileStudent.disciplines.length > 1 &&
                        <div className='student-data-title'>Уровень подготовки вокал</div>}
                        {profileStudent.disciplines.length > 1 && <PersonalDataSkill
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            number={1}
                        />}
                        <div className='student-data-title'>Идеальный тренер</div>
                        <PersonalDataPreferences
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Удобное время тренировок</div>
                        <PersonalDataTime
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.updateTrainingTime}
                        />
                    </Form>

                    <Button
                        className="student-data-saveBtn"
                        onClick={this.handleSubmitInfo}
                        btnText='Сохранить изменения'
                        size='default'
                        disable={this.state.uploadingNewData}
                        type='float'
                        style={{marginRight: "20px"}}
                    />

                    {this.state.uploadingNewData && <Spinner isInline={true} size="small"/>}
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
