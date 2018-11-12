import React from 'react';
import cn from 'classnames'

import Button from '../Button'
import Radio from '../RadioBox'

import './style.css'
import '../../icon/style.css'
import {Form} from "antd/lib/index";
import SelectNew from "../SelectNew";

import addInfoObj from "../../helpers/addInfoObj";
import langsArray from "../../helpers/langsArray";
import TextArea from "../TextArea";

const FormItem = Form.Item;

class PersonalInformationItemForm extends React.Component{
    constructor(props){
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const toSubmitObj = values;
                toSubmitObj.language = values.language.join(',');
                toSubmitObj.consultationPrice = values.consultationPrice.toString();
                this.props.onSubmit(toSubmitObj);
            }
        });
    };

    render(){
        const { getFieldDecorator } = this.props.form;

        let {language, isChildConsult, consultationPrice, isFreeConsult, about} = this.props.profileDoctor;

        const rootClass = cn('personal-information');
        const RadioGroup = Radio.Group;

        return (
                <Form className={rootClass} onSubmit={this.handleSubmit}>
                    <div className="personal-block">
                        <FormItem>
                            {getFieldDecorator('language', {
                                initialValue: typeof language === "string" ? language.split(',') : []
                            })(

                                <SelectNew width ="100%"
                                           bubbleplaceholder="Владение языками"
                                           className="personal-block-form-item"
                                           mode="multiple"
                                           data={langsArray}
                                />
                            )}
                        </FormItem>
                        <div className='radio-label'>Консультация детей:
                            {getFieldDecorator('isChildConsult', {
                                initialValue: isChildConsult
                            })(
                                <RadioGroup>
                                    <Radio value={true}>Да</Radio>
                                    <Radio value={false}>Нет</Radio>
                                </RadioGroup>
                            )}
                        </div>
                        <FormItem>
                            {getFieldDecorator('consultationPrice', {
                                initialValue: consultationPrice
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="Желаемая сумма оплаты за консультацию"
                                           className="personal-block-form-item"
                                           data={addInfoObj.payments}
                                />
                            )}
                        </FormItem>
                        <div className='radio-label'>Готовы проводить консультации бесплатно?
                            {getFieldDecorator('isFreeConsult', {
                                initialValue: isFreeConsult
                            })(
                                <RadioGroup>
                                    <Radio value={true}>Да</Radio>
                                    <Radio value={false}>Нет</Radio>
                                </RadioGroup>
                            )}
                        </div>
                        <FormItem>
                            <div className="textarea-label">О себе</div>
                            {getFieldDecorator('about', {
                                initialValue: about
                            })(

                                    <textarea className="textarea-field"
                                              style={{height: "200px"}}

                                    />
                            )}
                        </FormItem>
                    </div>

                    <div className="personal-block">
                        <Button
                            htmlType="submit"
                            btnText='Сохранить изменения'
                            size='default'
                            type='float'
                        />
                    </div>
                </Form>
        )
    }
}
const PersonalInformationItem  = Form.create()(PersonalInformationItemForm);

export default PersonalInformationItem
