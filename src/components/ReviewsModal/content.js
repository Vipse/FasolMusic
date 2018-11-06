import React from 'react';

import { Form } from 'antd';
import TextArea from '../TextArea'
import Rate from '../Rate'
import Button from '../Button'
import {message} from "antd"
import moment from "moment";
import Spinner from "../Spinner";

const FormItem = Form.Item;

class ContentForm extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: '',
            value: 1,

        };
    }
    handleChange = (value) => {
        this.setState({value})
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.visible===true && this.props.visible===false) {
            this.setState({message: "", value: 1})
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.state.message) {
            message.error("Введите текст отзыва");
            return
        }
        const obj = {
            comment: this.state.message,
            rating: this.state.value,
            date: moment().format("X"),
            ...this.props.info
        };
        console.log(obj);
        this.setState({loading:true}, () => {
            this.props.onSubmit(obj).then((res) => {
                console.log(res, "RES");
                this.setState({loading:false});
                if(+res.data.code===200) {
                    this.props.onCancel();
                    this.props.refresh();
                    message.success("Отзыв успешно оставлен")
                } else {
                    message.error("Произошла ошибка, попробуйте ещё раз")
                }
            })
        })
    };
    render(){
        return (
            <Form onSubmit={this.handleSubmit}
                  className="cancelVisitModal">
                {this.props.mustLeave && <p>Вы не оставили обязательный отзыв на бесплатный приём.</p>}
                <p>С целью повышения качества услуг просим вас оставить отзыв.</p>
                <FormItem>
                    <Rate onChange = {this.handleChange} value={this.state.value} defaultValue={1} starSize={20}/>
                    <span className="rate-number">{this.state.value ? this.state.value : 1}</span>
                </FormItem>
                <TextArea label='Текст отзыва'
                          value={this.state.message}
                          onChange={message => this.setState({message})}
                          className="cancelVisitModal-txtarea"/>
                <Button htmlType="submit"
                        size='default'
                        btnText='Сохранить'
                        type='float'/> {this.state.loading &&<Spinner isInline={true} size = "small"/>}
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
