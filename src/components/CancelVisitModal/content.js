import React from 'react';

import { Form } from 'antd';
import TextArea from '../TextArea'
import Upload from '../Upload'
import DatePicker from '../DatePicker'
import Button from '../Button'

import {previewFile} from '../../helpers/modifyFiles'

const FormItem = Form.Item;

class ContentForm extends React.Component{
    constructor(props){
        super(props);
        const {rangeSet} = props;

        this.state = {
            dpNum: rangeSet.length || 1,
            rangeSet: rangeSet,
            message: '',
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let tmp = {
            ...this.props.form.getFieldsValue(),
        }
        
        let rangeArr = [];
        for (let key in tmp){
            key.indexOf('range') === 0 && (tmp[key][0] || tmp[key][1]) && rangeArr.push({
                start: tmp[key][0].unix(),
                end: tmp[key][1].unix(),
            })
        }

        let response = {
            file: this.props.form.getFieldValue('file') 
                ? ( this.props.form.getFieldValue('file').fileList) 
                : [],
            comment: this.state.message,
            range: rangeArr,
        };

        this.props.onSave(response);
    };

    addDp = (e) => {
        e.preventDefault();
        const {dpNum} = this.state;
        if(dpNum< this.props.limit)
            this.setState({dpNum:(dpNum+1)})
    };

    dpChangeHandler = (arr, i) => {
        let newArr = this.state.rangeSet.concat();
        newArr[i] = {
            defaultStartValue: arr[0],
            defaultEndValue: arr[1],
        };

        this.setState({
            rangeSet: newArr,
        })
    };

    renderDp = (fieldDecorator) =>{
        let dpArr = [];
        for(let i =0; i<this.state.dpNum;i++){
            dpArr.push(
                <FormItem key={'range'+i}>
                    {fieldDecorator(`range${i}`)(
                        <DatePicker range
                                    rangeSet={this.state.rangeSet[i]}
                                    onChange={(dateArr) => this.dpChangeHandler(dateArr,i)}
                                    delimiter='&mdash;'/>
                    )}
                </FormItem>)
        }
        return (
            <div className="cancelVisitModal-datepickers">
                {dpArr}
            </div>
        );
    };

    changeFieldsVal = (dpNum = this.state.dpNum) => {
        const {rangeSet} = this.state;
        if (rangeSet.length){
            for(let i = 0; i < dpNum; i++){
                let {defaultStartValue, defaultEndValue} = rangeSet[i];
                this.props.form.setFieldsValue({
                    ['range'+i]: [defaultStartValue, defaultEndValue],
                });
            }
        }
        else {
            this.props.form.setFieldsValue({
                ['range0']: [null, null],
            });
        }
    };

    componentDidMount(){
        this.changeFieldsVal()
    }

    componentWillReceiveProps(nextProps){
        nextProps.visible == false ? (this.setState({message: ''}), this.props.form.resetFields()) : null;

        if (nextProps.rangeSet.length !== this.props.rangeSet.length){
            this.setState({
                dpNum: nextProps.rangeSet.length || 1,
                rangeSet: nextProps.rangeSet || [],
            })
        }
    }

    shouldComponentUpdate(nextProps){
        return nextProps.visible
    }

    componentDidUpdate(prevProps){
        if (this.props.rangeSet.length !== prevProps.rangeSet.length){
            this.changeFieldsVal((this.props.rangeSet.length || 1))
        }
    }

    modifyFiles = (file) => {
        if(!file.thumbUrl && !file.modify){
            file.modify = true;
            let that = this;
            previewFile(file.originFileObj, function (previewDataUrl) {
                file.thumbUrl = previewDataUrl;
            });
        }
        
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        let week = ['Пн', "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
        let WEek =  
         week.map((item, index) => 

                   ( <Button 
                    className="btn-change-week"
                    htmlType="submit"
                    size='default'
                    btnText='Сохранить'
                    type='week'
                    title={item}
                    btnText={item}
            /> )
          );
        return (
            <Form onSubmit={this.handleSubmit}
                  className="cancelVisitModal">

                <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                 eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                 Ut enim ad minim veniam
                </div>
                {WEek}
                {this.renderDp(getFieldDecorator)}
                

                <Button
                        className='cancelVisitModal-dpAdd'
                        size='file'
                        type='file'
                        icon='add-button'
                        svg
                />
                <Button 
                        className="btn-change-worktime"
                        htmlType="submit"
                        size='default'
                        btnText='Сохранить'
                        type='float'/>
            </Form>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
