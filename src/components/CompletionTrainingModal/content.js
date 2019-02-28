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
                        onClick={this.props.onComplete}
                        htmlType="submit"
                        btnText="Засчитать"
                        type="light-pink"
                    />
                    {!this.props.isTrial ? <Button
                        onClick={this.props.onTail}
                        htmlType="submit"
                        btnText="Перенести"
                        type="light-pink"
                    /> : null}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
