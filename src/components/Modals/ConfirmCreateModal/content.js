import React from 'react';
import { Form } from 'antd';

import Button from '../../Button'
import Radio from "../../RadioBox";
import RadioGroup from "antd/es/radio/group";
import { message } from 'antd'


const FormItem = Form.Item;

class ContentForm extends React.Component {

  

    render() {
        const { trial, form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div className="confirm-modal">
                <p>Хотите распределить созданные тренировки?</p>
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
