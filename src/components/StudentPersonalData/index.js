import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import PersonalDataContact from '../PersonalDataContact';
import PersonalDataInfo from "../PersonalDataInfo";
import PersonalDataSkill from "../PersonalDataSkill";
import PersonalDataPreferences from "../PersonalDataPreferences";

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
import antFormConfig from "../../helpers/antFormConfig"

class StudentPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            uploadingNewData: false,
            avatarLink: "",
            isChangePasswordModalVisible: false,
            isSendSuggestionsModalVisible: false,
            loadingSelectors: true,
            isSaveBtnActive: false
        }
    }

    componentDidMount() {
        const { avatar } = this.props.profileStudent;
        this.setState({
            avatarLink: avatar
        });

        const selectorsNames = ['interests', 'goal', 'discipline', 'qualities',
            'styles', 'professions', 'musicalExperience', 'countries'];

        const selectorsLoad = this.props.getMultipleSelectors(selectorsNames)
            .then(res => {
                this.setState({loadingSelectors: false,
                    isSaveBtnActive: res
                });
                if (!res) {
                    setTimeout(() => selectorsLoad(), 500);
                    message.error('Ошибка при загрузке данных для выбора. Повторная попытка', 5);
                }
            })
            .catch(err => console.log(err));
        selectorsLoad();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.profileStudent.avatar !== this.props.profileStudent.avatar)
            this.setState({avatar: this.props.profileStudent.avatar});
    }

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
        const {profileStudent: {id}, form: {getFieldValue, setFieldsValue}} = this.props;
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

    prepareDisciplines = (data) => {
        const {discipline, goal, styles, musicalExperience} = this.props.selectors;
        let disciplinesNumsArr = [];
        for (let key in data)
            if (key.indexOf('discipline-') !== -1) disciplinesNumsArr.push(+key.slice(11));

        let preparedDisciplines = [];
        disciplinesNumsArr.forEach((i) => {
            preparedDisciplines.push({
                discipline: getSelectedIDs(discipline, data["discipline-" + i]),
                specialization: getSelectedNestedIDs(discipline, data["specialization-" + i], [data["discipline-" + i]]),
                level: getSelectedNestedIDs(discipline, data["level-" + i], [data["discipline-" + i]], false, '2'),
                experiense: getSelectedIDs(musicalExperience, data["experiense-" + i]),
                goals: getSelectedIDs(goal, data["goals-" + i]),
                musicstyles: getSelectedIDs(styles, data["musicstyles-" + i]),
                favoritesingers: data["favoritesingers-" + i]
            });
        });

        return preparedDisciplines;
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll(antFormConfig, (err, values) => {
            if (!err && this.props.profileStudent.id) {
                const {interests, qualities, professions, countries} = this.props.selectors;

                const finalData = {
                    id: this.props.profileStudent.id,
                    name: values.name,
                    phones: values.phones,
                    email: values.email,
                    country: getSelectedIDs(countries, values.country),
                    avatar: this.state.avatarLink,

                    sex: values.sex === "Мужской" ? "m" : values.sex === "Женский" ? "w" : null,
                    datebirth: moment(values.datebirth).format('X'),
                    work: getSelectedIDs(professions, values.work),
                    interests: getSelectedIDs(interests, values.interests),

                    disciplines: this.prepareDisciplines(values),

                    bestsex: values.bestsex === "Мужской" ? "m" : values.bestsex === "Женский" ? "w" : null,
                    bestage: values.bestage,
                    bestishomework: values.bestishomework === "Да" ? 1 : values.bestishomework === "Нет" ? 0 : null,
                    bestqualities: getSelectedIDs(qualities, values.bestqualities),
                    bestcomment: values.bestcomment
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
        const { form, profileStudent, selectors } = this.props;
        const { avatarLink, uploadingNewData, isSaveBtnActive,
            isChangePasswordModalVisible, isSendSuggestionsModalVisible } = this.state;
        const { getFieldDecorator } = form;
        const {interests, professions, discipline, goal,
            styles, qualities, musicalExperience, countries} = selectors;

        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <Form className={"student-data-form"}>
                        <div className='student-data-title'>Контактные данные</div>
                        <PersonalDataContact
                            profile={profileStudent}
                            avatarLink={avatarLink}
                            onChangeAvatar={this.handleChangeAvatar}
                            onChangeSocial={this.handleChangeSocial}
                            getFieldDecorator={getFieldDecorator}
                            showChangePasswordModal={() => this.setState({isChangePasswordModalVisible: true})}
                            showSendSuggestionsModal={() => this.setState({isSendSuggestionsModalVisible: true})}
                            countriesList={getSelectorValues(countries)}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Дополнительная информация</div>
                        <PersonalDataInfo
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            interestsList={getSelectorValues(interests)}
                            professionsList={getSelectorValues(professions)}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Уровни подготовки по дисциплинам</div>
                        <PersonalDataSkill
                            profile={profileStudent}
                            form={form}
                            disciplineObj={discipline}
                            goalList={getSelectorValues(goal)}
                            stylesList={getSelectorValues(styles)}
                            musicalExperienceList={getSelectorValues(musicalExperience)}
                            isStudent={true}
                        />
                        <div className='student-data-title'>Идеальный тренер</div>
                        <PersonalDataPreferences
                            profile={profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            qualitiesList={getSelectorValues(qualities)}
                            isStudent={true}
                        />

                        <Button
                            className="student-data-saveBtn"
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
                        profile={profileStudent}
                        visible={isChangePasswordModalVisible}
                        onSubmit = {this.props.onChangePassword}
                        onCancel={() => this.setState({isChangePasswordModalVisible: false})}
                    />
                    <SendSuggestionsModal
                        profile={profileStudent}
                        visible={isSendSuggestionsModalVisible}
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
    onSubmit: PropTypes.func,
    onChangePassword: PropTypes.func
};

StudentPersonalData.defaultProps = {
    profileStudent: {},
    onSubmit: () => {},
    onChangePassword: () => {},
};

export default StudentPersonalData
