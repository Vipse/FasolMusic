import React from 'react';

import {Form} from 'antd';
import Button from '../Button'
import moment from 'moment'

class ContentForm extends React.Component {
    render() {
        const rootClass = 'completionTrainingModal';

        return (
            <Form className={rootClass}>
                <div className='btnPlate'>
                    <Button
                        onClick={this.props.onCancel}
                        htmlType="submit"
                        btnText="Отменить"
                    />
                    <Button
                        onClick={()=>{
                            this.props.onSave()
                            this.props.onCancel()
                        }}
                        htmlType="submit"
                        btnText="Подтвердить"
                        type="light-pink"
                    />
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
