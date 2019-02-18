import React from 'react';

import {Form} from 'antd';
import Button from '../Button'
import Rate from "../Rate";

const FormItem = Form.Item;

class ContentForm extends React.Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.visible !== this.props.visible && this.props.visible)
            this.props.form.resetFields();
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onSave(values.rate)
            }
        });
    };

    render() {
        const rootClass = 'RateCoachModal';
        const {getFieldDecorator} = this.props.form;

        return (
            <Form className={rootClass}>
                <p className='info'>Выберите оценку для коуча</p>
                <FormItem>
                    {getFieldDecorator('rate', {
                        initialValue: this.props.prevRate,
                        rules: [{
                            required: false,
                            message: 'Поставьте оценку, пожалуйста'
                        }],
                    })(
                        <Rate autoFocus starSize={30}/>
                    )}
                </FormItem>
                <div className='btnPlate'>
                    <Button
                        className="saveBtn"
                        onClick={this.handleSubmit}
                        btnText='Оценить'
                        size='default'
                        type='yellow'
                    />
                </div>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
