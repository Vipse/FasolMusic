import React from 'react';

import {Form} from 'antd';
import Button from '../Button'
import moment from 'moment'

class ContentForm extends React.Component {
    render() {
        const{ beginTime} = this.props;
        const rootClass = 'completionTrainingModal';

       // let afterStartTraining = (moment(beginTime) > moment()) ? true : false

        return (
            <Form className={rootClass}>
                <div className='btnPlate'>
                    <Button
                        onClick={this.props.onComplete}
                        htmlType="submit"
                        btnText="Засчитать"
                        type="light-pink"
                    />
                    {!this.props.isTrial ?
                    <Button
                        onClick={this.props.onTail}
                        htmlType="submit"
                        btnText="Перенести"
                        type="light-pink"
                    /> : 
                    <Button
                        onClick={() => {}}
                        
                        htmlType="submit"
                        btnText="Не пришел!"
                        type="light-pink"
                    />}
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
