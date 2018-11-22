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

class CoachPersonalDataForm extends React.Component {

    constructor() {
        super();
        this.state  = {}
    }

    handleSubmitInfo = (e) => {
        const outObj = {
            "id": "3396",
            "name": "Ivanov Ivan Ivanovich",
            "email": "ivanov@ii.ii",
            "avatar": "imagelink",
            "country": "Беларусь",
            "sex": "m",
            "phones": ["+3567248", "+2456323"],

            "datebirth": "1234567",

            "interests": ["Спорт", "Туризм"],
            "facebooklink": "faceLink",
            "googlelink": "googleLink",

            "improvetext": "impText",

            "disciplines": {
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

            "besttrainer": {
                "sex": "w",
                "age": "20-25",
                "ishomework": "true",
                "qualities": ["Качество1", "Качество2"],
                "comment": "trainerComment"
            },

            "amountdays": "1",
            "trainingtime": {
                "0": {

                    "datestart": "192323923",
                    "dateend": "192323923"
                },
                "2": {

                    "datestart": "192323923",
                    "dateend": "192323923"
                }}
        };
        e.preventDefault();
        this.handleSubmitInfo(outObj);
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
