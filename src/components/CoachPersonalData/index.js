import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import CoachPersonalDataContact from '../CoachPersonalDataContact'
import CoachPersonalDataInfo from "../CoachPersonalDataInfo";
import CoachPersonalDataPromo from "../CoachPersonalDataPromo";

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import {Form, message} from "antd";
import Spinner from "../Spinner";
import CoachPersonalDataPayment from "../CoachPersonalDataPayment";
import CoachPersonalDataSkill from "../CoachPersonalDataSkill";
import CoachPersonalDataPreferences from "../CoachPersonalDataPreferences";
import CoachPersonalDataTime from "../CoachPersonalDataTime";

class CoachPersonalData extends React.Component {

    constructor() {
        super();
        this.state  = {}
    }

    handleSubmitInfo = (e) => {
        e.preventDefault();
        /*this.props.form.validateFields((err, values) => {
            if (!err) {
                // this.setState({loadingInfo:true});
                if (this.state.avatar) {
                    values.avatar = {...this.state.avatar}
                }
                //this.props.onSubmit(values)
                // .then((res) => {
                //     this.setState({loadingInfo: false});
                //     if (res.data.code === 200) {
                //         message.success("Изменения сохранены")
                //     } else {
                //         message.error("Произошла ошибка, попробуйте ещё раз")
                //     }
                // })
            } else {
                console.log(err);
            }
        });*/
    };

    render() {
        const rootClass = cn('coach-data');
        return (
            <div className={rootClass}>
                <Card title="Мои личные данные">
                    <CoachPersonalDataContact
                        profileCoach={this.props.profileCoach}
                        onSubmitPassword={this.props.onSubmitPassword}
                        onDeleteAvatar={this.props.onDeleteAvatar}
                    />
                    <CoachPersonalDataInfo
                        profileCoach={this.props.profileCoach}
                    />
                    <CoachPersonalDataPromo
                        profileCoach={this.props.profileCoach}
                    />
                    <CoachPersonalDataPayment
                        profileCoach={this.props.profileCoach}
                    />
                    <CoachPersonalDataSkill
                        profileCoach={this.props.profileCoach}
                    />
                    <CoachPersonalDataPreferences
                        profileCoach={this.props.profileCoach}
                    />
                    <CoachPersonalDataTime
                        profileCoach={this.props.profileCoach}
                    />

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

CoachPersonalData.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalData.defaultProps = {
    profileCoach: {},
    onSubmit: () => {
    }
};

export default CoachPersonalData
