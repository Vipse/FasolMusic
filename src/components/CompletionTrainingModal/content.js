import React from 'react';

import {Form} from 'antd';
import Button from '../Button'

class ContentForm extends React.Component {
    render() {
        const rootClass = 'completionTrainingModal';

        return (
            <Form className={rootClass}>
                <p className='info'>Точно хотите завершить тренировку?</p>
                <div className='btnPlate'>
                    <Button
                        btnText="Нет"
                        type="light-pink"
                        onClick={this.props.onCancel}
                    />
                    <Button
                        onClick={this.props.onComplete}
                        htmlType="submit"
                        btnText="Да"
                        type="light-pink"
                    />
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
