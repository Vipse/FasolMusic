import React from 'react';
import { Form } from 'antd';

import Button from '../Button'
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";


const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        selectedDays: []
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.visible !== this.props.visible && this.props.visible)
            this.setState({ loading: false });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { unauthorized } = this.props;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                let finalData = {
                    ...values,
                };

                let selectedDaysObj = {};
                if (unauthorized) finalData.amount = 1;

                for (let i = 0; i < 7; ++i)
                    selectedDaysObj[i] = true;
                finalData.selectedDays = selectedDaysObj;

                this.props.onSave(finalData);
            }
            else console.log("error", err);
        })
    };

    handleDayCheck = (num) => {
        let newSelectedState = this.state.selectedDays;
        newSelectedState[num] = !newSelectedState[num];
        this.setState({
            selectedDays: newSelectedState
        });
    };

    renderDisciplines = () => {
        const { availableDisciplines, disciplinesList } = this.props;
        let radioDisciplinesArr = [];

        //debugger
        for (let discipline in disciplinesList) {
            let item = disciplinesList[discipline];
            if (!availableDisciplines || !availableDisciplines[item.code])
                radioDisciplinesArr.push(<Radio value={item.name} key={'radio-' + item.name}>
                    {item.ruText}
                </Radio>);
        }

        return radioDisciplinesArr;
    };

    render() {
        const {  trial, form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={this.handleSubmit}
                className="CreateTrainModal">
                <p className="info">Для записи на {trial ? 'пробную ' : null}тренировку выберите дисциплину</p>
                <div className='controls'>
                    <div className="item">
                        <FormItem>
                            <div className='radio-label'>Выбери дисциплину</div>
                            {getFieldDecorator('type', {
                                rules: [{
                                    required: true,
                                    message: 'Выберите дисциплину, пожалуйста'
                                }],
                            })(
                                <div className="ant-radio-group">
                                    <RadioGroup style={{ display: "flex", flexDirection: "row" }}>
                                        {this.renderDisciplines()}
                                    </RadioGroup>
                                </div>
                            )}
                        </FormItem>
                        
                        <p className="info-small">Вам покажется расписание со свободным временем наших коучей,
                            выберите ячейку и коуча
                        </p>
                    </div>

                </div>
                <div className="submitPlate">
                    <Button
                        className="saveBtn"
                        btnText='Далее'
                        onClick={() => {
                        }}
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
