import React from 'react'

import { Form } from 'antd';

import Select from '../Select'
import Radio from '../RadioBox'
import SelectNew from "../SelectNew";
import TextArea from "../TextArea";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

/* styles in style.css (importing in Step2.js)*/

class Step2_additional extends React.Component{

    render(){
        const {getFieldDecorator,langs, payments} = this.props;

        return (
            <div className="step-block">
                <FormItem>
                    {getFieldDecorator('language')(

                        <SelectNew width ="100%"
                                   bubbleplaceholder="Владение языками"
                                   className="step-form-item"
                                   mode="multiple"
                                   data={langs}
                        />
                    )}
                </FormItem>
                <div className='radio-label'>Консультация детей:
                        {getFieldDecorator('isChildConsult', {
                            initialValue: false
                        })(
                            <RadioGroup>
                                <Radio value={true}>Да</Radio>
                                <Radio value={false}>Нет</Radio>
                            </RadioGroup>
                        )}
                </div>


                <FormItem>
                    {getFieldDecorator('consultPayment')(

                        <SelectNew width ="100%"
                        bubbleplaceholder="Желаемая сумма оплаты за консультацию"
                        className="step-form-item"
                        data={payments}
                        />
                    )}
                </FormItem>
                <div className='radio-label'>Готовы проводить консультации бесплатно?
                    {getFieldDecorator('isFreeConsult', {
                        initialValue: false
                    })(
                        <RadioGroup>
                            <Radio value={true}>Да</Radio>
                            <Radio value={false}>Нет</Radio>
                        </RadioGroup>
                    )}
                </div>
                <FormItem>
                    {getFieldDecorator('about')(
                        <TextArea label="О себе"
                                  className="step-form-item"
                                  style={{height:"200px"}}

                        />
                    )}
                </FormItem>
            </div>
        )
    }
}


export default Step2_additional
