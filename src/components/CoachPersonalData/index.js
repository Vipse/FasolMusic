import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button';
import PersonalDataContact from '../PersonalDataContact';
import PersonalDataInfo from "../PersonalDataInfo";
import CoachPersonalDataPromo from "../CoachPersonalDataPromo";
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
import {
    getSelectedIDs,
    getSelectedNestedIDs,
    getSelectorValues
} from "../../helpers/getSelectorsCustomData";

class CoachPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatar: "",
            promoLink: "",
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([[10, 20]])
            },
            isChangePasswordModalVisible: false,
            isSendSuggestionsModalVisible: false,
            isChangePromoModalVisible: false,
            selectorsValues: {}
        }
    }

    componentDidMount() {
        const { avatar, promovideo } = this.props.profileCoach;
        this.setState({
            avatar: avatar,
            promoLink: promovideo
        });
        this.loadTrainingTime();

        const {getSelectors} = this.props;
        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities',
            'styles', 'professions', 'day', 'musicalExperience', 'countries'];

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
        const {trainingtime} = this.props.profileCoach;
        for (let i = 0; i < 7; ++i) {
            let isEnabled = false;
            let selectedDayTimesArr = [];

            Array.isArray(trainingtime) && trainingtime.length && trainingtime.forEach((item) => {
                let num = item.day ? +item.day[0].value : null;
                if (num === i) {
                    isEnabled = true;
                    selectedDayTimesArr.push([
                        moment(item.datestart * 1000).hours(),
                        moment(item.dateend * 1000).hours()
                    ]);
                }
            });

            this.handleChangeTrainingTime('enabledDays', i, isEnabled);
            if (selectedDayTimesArr.length) this.handleChangeTrainingTime('selectedTimes', i, selectedDayTimesArr);
        }
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

    handleChangePromo = (link) => {
        this.setState({promoLink: link});

        let updateData = {
            id: this.props.profileCoach.id,
            promovideo: link
        };

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
        const {disciplineList, goalList, stylesList, musicalExperienceList} = this.state.selectorsValues;
        let disciplinesNumsArr = [];
        for (let key in data)
            if (key.indexOf('discipline-') !== -1) disciplinesNumsArr.push(+key.slice(11));

        let preparedDisciplines = [];
        disciplinesNumsArr.forEach((i) => {
            preparedDisciplines.push({
                discipline: getSelectedIDs(disciplineList, data["discipline-" + i]),
                specialization: getSelectedNestedIDs(disciplineList, data["specialization-" + i], [data["discipline-" + i]]),
                receptions: getSelectedNestedIDs(disciplineList, data["receptions-" + i], [data["discipline-" + i], data["specialization-" + i]]),
                level: getSelectedNestedIDs(disciplineList, data["level-" + i], [data["discipline-" + i]], false, '2'),
                experiense: getSelectedIDs(musicalExperienceList, data["experiense-" + i]),
                goals: getSelectedIDs(goalList, data["goals-" + i]),
                musicstyles: getSelectedIDs(stylesList, data["musicstyles-" + i]),
                favoritesingers: data["favoritesingers-" + i]
            });
        });

        return preparedDisciplines;
    };

    prepareTrainingTime = () => {
        const {selectorsValues: {dayList}, trainingTime: {enabledDays, selectedTimes}} = this.state;
        let preparedTrainingTime = {};
        let objIndex = 0;

        for (let i = 0; i < 7; ++i) {
            enabledDays[i] && selectedTimes[i].forEach((interval) => {
                preparedTrainingTime[objIndex] = {
                    day: getSelectedIDs(dayList, String(i), true),
                    datestart: moment(interval[0], 'HH').format('X'),
                    dateend: moment(interval[1], 'HH').format('X')
                };
                ++objIndex;
            });
        }
        return preparedTrainingTime;
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.profileCoach.id) {
                const {interestsList, qualitiesList, professionsList, countriesList} = this.state.selectorsValues;

                const finalData = {
                    id: this.props.profileCoach.id,
                    name: values.name,
                    phones: values.phones,
                    email: values.email,
                    country: getSelectedIDs(countriesList, values.country),
                    avatar: this.state.avatar,

                    sex: values.sex === "Мужской" ? "m" : values.sex === "Женский" ? "w" : null,
                    datebirth: moment(values.datebirth).format('X'),
                    work: getSelectedIDs(professionsList, values.work),
                    interests: getSelectedIDs(interestsList, values.interests),
                    aboutme: values.aboutme,

                    promovideo: this.state.promoLink,

                    disciplines: this.prepareDisciplines(values),

                    bestsex: values.bestsex === "Мужской" ? "m" : values.bestsex === "Женский" ? "w" : null,
                    bestage: values.bestage,
                    bestishomework: values.bestishomework === "Да" ? 1 : values.bestishomework === "Нет" ? 0 : null,
                    bestqualities: getSelectedIDs(qualitiesList, values.bestqualities),
                    bestcomment: values.bestcomment,

                    trainingtime: this.prepareTrainingTime()
                };

                this.setState({uploadingNewData: true});
                this.props.onSubmit(finalData)
                    .then((res) => {
                        this.setState({uploadingNewData: false});
                        if (res && !res.data.error) {
                            if (res.data.result.testTrainingTime)
                                message.success("Изменения сохранены");
                            else message.warning('Удобное время проведения не изменено, т.к. имеются незавершенные тренировки!', 10);
                        } else
                            message.error("Произошла ошибка, попробуйте ещё раз");
                    });
            } else
                console.log("error", err);
        })
    };

    render() {
        const rootClass = cn('coach-data');
        const { form, profileCoach } = this.props;
        const { getFieldDecorator } = form;
        const {interestsList, professionsList, disciplineList, goalList,
            stylesList, qualitiesList, musicalExperienceList, countriesList} = this.state.selectorsValues;
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
                            countriesList={getSelectorValues(countriesList)}
                        />
                        <div className='coach-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            interestsList={getSelectorValues(interestsList)}
                            professionsList={getSelectorValues(professionsList)}
                        />
                        <div className='coach-data-title'>Проморолик</div>
                        <CoachPersonalDataPromo
                            profile={profileCoach}
                            onChangePromo={this.handleChangePromo}
                        />
                        <div className='coach-data-title'>Уровень подготовки по дисциплине</div>
                        <PersonalDataSkill
                            profile={profileCoach}
                            form={form}
                            disciplineObj={disciplineList}
                            goalList={getSelectorValues(goalList)}
                            stylesList={getSelectorValues(stylesList)}
                            musicalExperienceList={getSelectorValues(musicalExperienceList)}
                        />
                        <div className='coach-data-title'>Идеальный студент</div>
                        <PersonalDataPreferences
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            qualitiesList={getSelectorValues(qualitiesList)}
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
                        onSubmit={this.props.onSubmit}
                        onCancel={() => this.setState({isChangePasswordModalVisible: false})}
                    />
                    <SendSuggestionsModal
                        profile={profileCoach}
                        visible={this.state.isSendSuggestionsModalVisible}
                        onSubmit={this.props.onSubmit}
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
