import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import PersonalDataContact from '../PersonalDataContact';
import PersonalDataInfo from "../PersonalDataInfo";
import PersonalDataSkill from "../PersonalDataSkill";
import PersonalDataPreferences from "../PersonalDataPreferences";
import PersonalDataTime from "../PersonalDataTime";

import './style.css'
import '../../icon/style.css'

import Card from "antd/es/card";
import {Form, message} from "antd";
import Button from '../Button';
import Spinner from "../Spinner";
import moment from "moment";
import ChangePasswordModal from "../ChangePasswordModal";

class StudentPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatar: "",
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([10, 23])
            },
            isChangePasswordModalVisible: false
        }
    }

    componentDidMount() {
        const { avatar } = this.props.profileStudent;
        this.setState({
            avatar: avatar
        });
        this.loadTrainingTime();
    }

    loadTrainingTime = () => {
        const { trainingtime } = this.props.profileStudent;
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
            id: this.props.profileStudent.id,
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
        return JSON.stringify(preparedTrainingTime) !== '{}' ? preparedTrainingTime : this.props.profileStudent.trainingtime;
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
                    avatar: this.state.avatar,

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
        const rootClass = cn('student-data');
        const { form, profileStudent } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"student-data-form"}>
                        <div className='student-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileStudent}
                            onChangeAvatar={this.handleChangeAvatar}
                            onChangeSocial={this.handleChangeSocial}
                            getFieldDecorator={getFieldDecorator}
                            showChangePasswordModal={() => this.setState({isChangePasswordModalVisible: true})}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Уровни подготовки по дисциплинам</div>
                        <PersonalDataSkill
                            profile={profileStudent}
                            form={form}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Идеальный тренер</div>
                        <PersonalDataPreferences
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Удобное время тренировок</div>
                        <PersonalDataTime
                            trainingTime={this.state.trainingTime}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.handleChangeTrainingTime}
                        />

                        <Button
                            className="student-data-saveBtn"
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
                        profile={profileStudent}
                        visible={this.state.isChangePasswordModalVisible}
                        onSubmit = {this.props.onSubmit}
                        onCancel={() => this.setState({isChangePasswordModalVisible: false})}
                    />
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
