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
import antFormConfig from "../../helpers/antFormConfig"

class CoachPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatarLink: "",
            promoLink: "",
            trainingTime: {
                enabledDays: new Array(7).fill(false),
                selectedTimes: new Array(7).fill([[10, 20]])
            },
            isChangePasswordModalVisible: false,
            isSendSuggestionsModalVisible: false,
            isChangePromoModalVisible: false,
            loadingSelectors: true,
            isSaveBtnActive: false
        }
    }

    componentDidMount() {
        const { avatar, promovideo } = this.props.profileCoach;
        this.setState({
            avatarLink: avatar,
            promoLink: promovideo
        });
        this.loadTrainingTime();

        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities',
            'styles', 'professions', 'day', 'musicalExperience', 'countries'];

        const selectorsLoad = () => this.props.getMultipleSelectors(selectorsNames)
            .then(res => {
                this.setState({loadingSelectors: false,
                    isSaveBtnActive: res
                });
                if (!res) {
                    setTimeout(() => selectorsLoad(), 5000);
                    message.error('Ошибка при загрузке данных для выбора. Повторная попытка', 5);
                }
            })
            .catch(err => console.log(err));
        selectorsLoad();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profileCoach.avatar !== this.props.profileCoach.avatar)
            this.setState({avatar: this.props.profileCoach.avatar});
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
                        moment.unix(+item.datestart).utcOffset("+03:00").hours(),
                        moment.unix(+item.dateend).utcOffset("+03:00").hours()
                    ]);
                }
            });

            this.handleChangeTrainingTime('enabledDays', i, isEnabled);
            if (selectedDayTimesArr.length) this.handleChangeTrainingTime('selectedTimes', i, selectedDayTimesArr);
        }
    };

    handleChangeAvatar = (file, isLink) => {
        if (isLink) this.setState({avatarLink: file});
        else if (file && file.name !== 'default')
            return this.props.uploadFile(file)
                .then((res) => {
                    this.setState({avatarLink: res.data.file[0].url});
                    message.success("Фото загружено");
                    return res;
                })
                .catch((err) => {console.log(err); return err});
        else this.setState({avatarLink: ''});
    };

    handleChangeSocial = (name, valuesObj) => {
        const {profileCoach: {id}, form: {getFieldValue, setFieldsValue}} = this.props;
        const {avatarLink} = this.state;
        const checkableFields = ['name', 'email'];
        checkableFields.forEach(item => {
            if (!getFieldValue(item) && valuesObj[item]) {
                setFieldsValue({[item]: valuesObj[item]});
            }
        });

        if (!avatarLink && valuesObj.avatar) {
            this.handleChangeAvatar(valuesObj.avatar, true);
        }

        if (valuesObj.link)
            return this.props.onSocialConnect(id, valuesObj.link, name);
        else {
            const resetObj = {
                id: id,
                [name + 'link']: valuesObj.link
            };
            return this.props.onSubmit(resetObj);
        }
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
        const {discipline, styles, musicalExperience} = this.props.selectors;
        let disciplinesNumsArr = [];
        for (let key in data)
            if (key.indexOf('discipline-') !== -1) disciplinesNumsArr.push(+key.slice(11));

        let preparedDisciplines = [];
        disciplinesNumsArr.forEach((i) => {
            preparedDisciplines.push({
                discipline: getSelectedIDs(discipline, data["discipline-" + i]),
                specialization: getSelectedNestedIDs(discipline, data["specialization-" + i], [data["discipline-" + i]]),
                receptions: getSelectedNestedIDs(discipline, data["receptions-" + i], [data["discipline-" + i], data["specialization-" + i]]),
                level: getSelectedNestedIDs(discipline, data["level-" + i], [data["discipline-" + i]], false, '2'),
                experiense: getSelectedIDs(musicalExperience, data["experiense-" + i], true),
                musicstyles: getSelectedIDs(styles, data["musicstyles-" + i]),
                favoritesingers: data["favoritesingers-" + i]
            });
        });

        return preparedDisciplines;
    };

    prepareTrainingTime = () => {
        const {trainingTime: {enabledDays, selectedTimes}} = this.state;
        const {day} = this.props.selectors;
        let preparedTrainingTime = {};
        let objIndex = 0;

        for (let i = 0; i < 7; ++i) {
            enabledDays[i] && selectedTimes[i].forEach((interval) => {
                preparedTrainingTime[objIndex] = {
                    day: getSelectedIDs(day, String(i), true),
                    datestart: moment().utcOffset("+03:00").startOf('day').hour(interval[0]).format('X'),
                    dateend: moment().utcOffset("+03:00").startOf('day').hour(interval[1]).format('X')
                };
                ++objIndex;
            });
        }
        return preparedTrainingTime;
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll(antFormConfig, (err, values) => {
            if (!err && this.props.profileCoach.id) {
                const {interests, qualities, countries} = this.props.selectors;

                const finalData = {
                    id: this.props.profileCoach.id,
                    name: values.name,
                    phones: values.phones,
                    email: values.email,
                    country: getSelectedIDs(countries, values.country),
                    avatar: this.state.avatarLink,

                    sex: values.sex === "Мужской" ? "m" : values.sex === "Женский" ? "w" : null,
                    datebirth: moment(values.datebirth).format('X'),
                    interests: getSelectedIDs(interests, values.interests),
                    aboutme: values.aboutme,

                    promovideo: this.state.promoLink,

                    disciplines: this.prepareDisciplines(values),

                    bestsex: values.bestsex === "Мужской" ? "m" : values.bestsex === "Женский" ? "w" : null,
                    bestage: values.bestage,
                    bestishomework: values.bestishomework === "Да" ? 1 : values.bestishomework === "Нет" ? 0 : null,
                    bestqualities: getSelectedIDs(qualities, values.bestqualities),
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
        const {avatarLink, trainingTime, uploadingNewData, isSaveBtnActive,
            isChangePasswordModalVisible, isSendSuggestionsModalVisible} = this.state;
        const { getFieldDecorator } = form;
        const {interests, discipline, styles, qualities,
            musicalExperience, countries} = this.props.selectors;

        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"coach-data-form"}>
                        <div className='coach-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileCoach}
                            avatarLink={avatarLink}
                            onChangeAvatar={this.handleChangeAvatar}
                            onChangeSocial={this.handleChangeSocial}
                            getFieldDecorator={getFieldDecorator}
                            showChangePasswordModal={() => this.setState({isChangePasswordModalVisible: true})}
                            showSendSuggestionsModal={() => this.setState({isSendSuggestionsModalVisible: true})}
                            countriesList={getSelectorValues(countries)}
                            askForPermissionToReceiveNotifications={this.props.askForPermissionToReceiveNotifications}
                            pushNotificationsToken={this.props.pushNotificationsToken}
                        />
                        <div className='coach-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            interestsList={getSelectorValues(interests)}
                        />
                        <div className='coach-data-title'>Проморолик</div>
                        <CoachPersonalDataPromo
                            profile={profileCoach}
                            onChangePromo={this.handleChangePromo}
                        />
                        <div className='coach-data-title'>Выбери, что будешь преподавать</div>
                        <PersonalDataSkill
                            profile={profileCoach}
                            form={form}
                            disciplineObj={discipline}
                            stylesList={getSelectorValues(styles)}
                            musicalExperienceList={getSelectorValues(musicalExperience, true)}
                        />
                        <div className='coach-data-title'>Идеальный студент</div>
                        <PersonalDataPreferences
                            profile={profileCoach}
                            getFieldDecorator={getFieldDecorator}
                            qualitiesList={getSelectorValues(qualities)}
                        />
                        <div className='coach-data-title'>Удобное время проведения тренировок</div>
                        <PersonalDataTime
                            trainingTime={trainingTime}
                            getFieldDecorator={getFieldDecorator}
                            onChange={this.handleChangeTrainingTime}
                        />

                        <Button
                            className="coach-data-saveBtn"
                            onClick={this.handleSubmitInfo}
                            btnText='Сохранить изменения'
                            size='default'
                            disable={uploadingNewData || !isSaveBtnActive}
                            type='light-blue'
                            style={{marginRight: "20px"}}
                        />

                        {uploadingNewData && <Spinner isInline={true} size="small"/>}
                    </Form>

                    <ChangePasswordModal
                        profile={profileCoach}
                        visible={isChangePasswordModalVisible}
                        onSubmit={this.props.onChangePassword}
                        onCancel={() => this.setState({isChangePasswordModalVisible: false})}
                    />
                    <SendSuggestionsModal
                        profile={profileCoach}
                        visible={isSendSuggestionsModalVisible}
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
    onSubmit: PropTypes.func,
    onChangePassword: PropTypes.func
};

CoachPersonalData.defaultProps = {
    profileCoach: {},
    onSubmit: () => {},
    onChangePassword: () => {}
};

export default CoachPersonalData
