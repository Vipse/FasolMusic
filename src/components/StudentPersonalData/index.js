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

class StudentPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state = {
            avatarLink: "",
            facebookLink: "",
            googleLink: ""
        }
    }

    componentDidMount() {
        this.setState({
            avatarLink: this.props.profileStudent.avatar,
            facebookLink: this.props.profileStudent.facebooklink,
            googleLink: this.props.profileStudent.googlelink
        })
    }

    updateLink = (type, link) => {
        this.setState({[type + "Link"]: link})
    };

    handleSubmitInfo = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err && this.props.profileStudent.id) {
                const finalData = {
                    id: this.props.profileStudent.id,
                    name: values.name,
                    phones: values.phones,
                    email: values.email,
                    country: values.country,
                    //avatar: this.state.avatarLink,
                    //facebooklink: this.state.facebookLink,
                    //googlelink: this.state.googleLink,

                    sex: values.sex,
                    datebirth: values.datebirth,
                    //+сфера деятельности
                    interests: values.interests,

                    /*disciplines: {
                        "0": {
                            "discipline": "Гитара",
                            "specialization": ["spec1", "spec2"],
                            "level": "level",
                            "experiense": "21",
                            "goals": ["Саморазвитие", "Саморазвитие 2"],
                            "musicstyles": ["Рок", "Поп"],
                            "favoritesingers": ["fav1", "fav2"]
                        },
                        "1": {
                            "discipline": "Вокал",
                            "specialization": ["spec1", "spec2"],
                            "level": "level",
                            "experiense": "21",
                            "goals": ["Саморазвитие", "Саморазвитие 2"],
                            "musicstyles": ["Рок", "Поп"],
                            "favoritesingers": ["fav1", "fav2"]
                        }},

                    besttrainer: {
                        "sex": "w",
                        "age": "20-25",
                        "ishomework": "true",
                        "qualities": ["Качество1", "Качество2"],
                        "comment": "trainerComment"
                    },
                    trainingtime: {
                        "0": {
                            "datestart": "192323923",
                            "dateend": "192323923"
                        },
                        "2": {
                            "datestart": "192323923",
                            "dateend": "192323923"
                        }}*/
                };

                this.setState({loading: true});
                console.log("FINAL REG DATA", values);
                //this.props.onSubmit(finalData);
            }
            else console.log("error", err);
        })
    };

    render() {
        const rootClass = cn('student-data');
        const { getFieldDecorator } = this.props.form;
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
                        <div className='student-data-title'>Уровень подготовки вокал</div>
                        <PersonalDataSkill
                            profile={this.props.profileStudent}
                            getFieldDecorator={getFieldDecorator}
                            number={1}
                        />
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
