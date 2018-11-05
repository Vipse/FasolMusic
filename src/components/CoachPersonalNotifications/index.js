import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import Card from "antd/es/card";
import InputNew from "../InputNew";
import Spinner from "../Spinner";
import {Form, message} from "antd";
import Checkbox from "../Checkbox";

const FormItem = Form.Item;

class CoachPersonalNotificationsForm extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    handleSubmitNotification = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //this.setState({loadingNotification:true});

                console.log("notification", values);
            } else {
                console.log(err);
            }
        });
    };

    renderNotificationTypes = (notificationsNamesArr) => {
        let notificationsArr = [];
        for (let i = 0; i < notificationsNamesArr.length; i++)
            notificationsArr.push(<div className="notifications">
                <Checkbox className="largeChk" value={i} key={"notification-" + i}>
                    {notificationsNamesArr[i]}</Checkbox>
            </div>);
        return notificationsArr;
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const notificationsNames = {
            email: ["Тип 1", "Тип 2", "Тип 3", "Тип 4"],
            phone: ["Тип 1", "Тип 2", "Тип 3", "Тип 4", "Тип 5", "Тип 6"]
        };
        const rootClass = cn('personal-notifications');
        return (
            <Form className={rootClass}>
                <Card title="Уведомления">
                    <div className='notifications-column'>
                        <div className='notifications-column-input'>
                            <div className='personal-notifications-type'>
                                <div className='personal-notifications-title'>Присылать на почту</div>
                                {this.renderNotificationTypes(notificationsNames.email)}
                            </div>

                            <div className='personal-notifications-type'>
                                <div className='personal-notifications-title'>На телефон</div>
                                {this.renderNotificationTypes(notificationsNames.phone)}
                            </div>
                        </div>

                        <Button
                            btnText='Сохранить изменения'
                            onClick={this.handleSubmitNotification}
                            size='default'
                            type='float'
                            style={{marginRight: "20px"}}
                        />

                        {this.state.loadingNotification && <Spinner isInline={true} size="small"/>}
                    </div>
                </Card>
            </Form>
        )
    }
}

const CoachPersonalNotifications  = Form.create()(CoachPersonalNotificationsForm);

CoachPersonalNotifications.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

CoachPersonalNotifications.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default CoachPersonalNotifications
