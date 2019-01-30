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
import SendSuggestionsModal from "../SendSuggestionsModal";
import {
    getSelectedIDs,
    getSelectedNestedIDs,
    getSelectorValues
} from "../../helpers/getSelectorsCustomData";

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
            isChangePasswordModalVisible: false,
            isSendSuggestionsModalVisible: false,
            selectorsValues: {}
        }
    }

    componentDidMount() {
        const { avatar } = this.props.profileStudent;
        this.setState({
            avatar: avatar
        });
        this.loadTrainingTime();

        const {getSelectors} = this.props;
        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities', 'styles', 'professions', 'day'];

        selectorsNames.forEach((name) => {
            getSelectors(name)
                .then(res => this.setState({
                    selectorsValues: {
                        ...this.state.selectorsValues,
                        [name + "List"]: res.data
                    }}))
                .catch(err => console.log(err))
        });
    }

    loadTrainingTime = () => {
        const { trainingtime } = this.props.profileStudent;
        Array.isArray(trainingtime) && trainingtime.length && trainingtime.forEach((item) => {
            let num = item.day ? item.day[0].value : null;
            this.handleChangeTrainingTime('enabledDays', num, true);
            this.handleChangeTrainingTime('selectedTimes', num, [
                moment(item.datestart * 1000).hours(),
                moment(item.dateend * 1000).hours()
            ]);
        });
    };

    handleChangeAvatar = (file) => {
        if (file && file.name !== 'default')
            return this.props.uploadFile(file)
                .then((res) => {
                    this.setState({avatar: res.data.file[0].url});
                    message.success("Фото загружено");
                    return res;
                })
                .catch((err) => {console.log(err); return err});
        else this.setState({avatar: ''});
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
        const {disciplineList, goalList, stylesList} = this.state.selectorsValues;
        let disciplinesNumsArr = [];
        for (let key in data)
            if (key.indexOf('discipline-') !== -1) disciplinesNumsArr.push(+key.slice(11));

        let preparedDisciplines = [];
        disciplinesNumsArr.forEach((i) => {
            preparedDisciplines.push({
                discipline: getSelectedIDs(disciplineList, data["discipline-" + i]),
                specialization: getSelectedNestedIDs(disciplineList, data["specialization-" + i], [data["discipline-" + i]]),
                level: data["level-" + i],
                experiense: data["experience-" + i],
                goals: getSelectedIDs(goalList, data["goals-" + i]),
                musicstyles: getSelectedIDs(stylesList, data["musicstyles-" + i]),
                favoritesingers: data["favoritesingers-" + i]
            });
        });

        return preparedDisciplines;
    };

    prepareTrainingTime = () => {
        const {dayList} = this.state.selectorsValues;
        let preparedTrainingTime = {};
        for (let i = 0; i < 7; ++i) {
            this.state.trainingTime.enabledDays[i] ? preparedTrainingTime[i] = {
                day: getSelectedIDs(dayList, String(i), true),
                datestart: moment(this.state.trainingTime.selectedTimes[i][0], 'HH').format('X'),
                dateend: moment(this.state.trainingTime.selectedTimes[i][1], 'HH').format('X')
            } : null;
        }
        return JSON.stringify(preparedTrainingTime) !== '{}' ? preparedTrainingTime : this.props.profileStudent.trainingtime;
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.profileStudent.id) {
                const {interestsList, qualitiesList, professionsList} = this.state.selectorsValues;

                const finalData = {
                    id: this.props.profileStudent.id,
                    name: values.name,
                    phones: values.phones,
                    email: values.email,
                    country: values.country,
                    avatar: this.state.avatar,

                    sex: values.sex === "Мужской" ? "m" : "w",
                    datebirth: moment(values.datebirth).format('X'),
                    work: getSelectedIDs(professionsList, values.work),
                    interests: getSelectedIDs(interestsList, values.interests),

                    disciplines: this.prepareDisciplines(values),

                    bestsex: values.bestsex === "Мужской" ? "m" : "w",
                    bestage: values.bestage,
                    bestishomework: values.bestishomework === "Да",
                    bestqualities: getSelectedIDs(qualitiesList, values.bestqualities),
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
        const {interestsList, professionsList, disciplineList, goalList, stylesList, qualitiesList} = this.state.selectorsValues;
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
                            showSendSuggestionsModal={() => this.setState({isSendSuggestionsModalVisible: true})}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            interestsList={getSelectorValues(interestsList)}
                            professionsList={getSelectorValues(professionsList)}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Уровни подготовки по дисциплинам</div>
                        <PersonalDataSkill
                            profile={profileStudent}
                            form={form}
                            disciplineObj={disciplineList}
                            goalList={getSelectorValues(goalList)}
                            stylesList={getSelectorValues(stylesList)}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Идеальный тренер</div>
                        <PersonalDataPreferences
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            qualitiesList={getSelectorValues(qualitiesList)}
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
                    <SendSuggestionsModal
                        profile={profileStudent}
                        visible={this.state.isSendSuggestionsModalVisible}
                        onSubmit = {this.props.onSubmit}
                        onCancel={() => this.setState({isSendSuggestionsModalVisible: false})}
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
