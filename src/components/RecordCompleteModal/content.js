import React from 'react';
import {Form, message} from 'antd';
import Button from '../Button'

class ContentForm extends React.Component {
    state = {};

    render() {
        const {getFieldDecorator} = this.props.form;
        const {type, date, time} = this.props;

        return (
                <div className="RecordCompleteModal">
                    {
                        type === 'trial' ? <p className="info">Ваша пробная тренировка {date} в {time}.</p> :
                            type === 'transfer' ? <p className="info">Тренировка от {date[0]} в {time[0]} перенесена на {date[1]} в {time[1]}.</p> :
                                <p className="info">Ваша тренировка {date} в {time}.</p>
                    }
                    <Button className="saveBtn"
                            btnText='ОК'
                            onClick={() => {
                            }}
                            size='default'
                            type='light-pink'
                    />
                </div>
        );
    }
}

const Content = Form.create()(ContentForm);

export default Content
