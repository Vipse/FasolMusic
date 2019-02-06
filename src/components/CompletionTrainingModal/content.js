import React from 'react';

import {Form} from 'antd';
import Button from '../Button'

class ContentForm extends React.Component {
    render() {
        const rootClass = 'completionTrainingModal';

        return (
            <Form className={rootClass}>
                <div className='btnPlate'>
                    <Button
                        onClick={this.props.onPause}
                        htmlType="submit"
                        btnText="Приостановить"
                        type="light-pink"
                    />
                    <Button
                        onClick={this.props.onComplete}
                        htmlType="submit"
                        btnText="Засчитать"
                        type="light-pink"
                    />
                    <Button
                        onClick={this.props.onTail}
                        htmlType="submit"
                        btnText="Перенести"
                        type="light-pink"
                    />
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
