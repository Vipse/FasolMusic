import React from 'react';
import { Form } from 'antd';

import Button from '../../Button'
import Radio from "../../RadioBox";
import RadioGroup from "antd/es/radio/group";
import {message} from 'antd'


const FormItem = Form.Item;

class ContentForm extends React.Component {
    state = {
        message: '',
        loading: false,
        selectedDays: []
    };


    handleSubmit = (e) => {
        e.preventDefault();
        const { 
            form, 
            visible_CreateTrainModal_Unfreeze,
            visible_CreateTrainModal_Trial,

            listDisciplines,

            changeCurrDiscipline,
            closeModal
        } = this.props;

        form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                if(visible_CreateTrainModal_Unfreeze) {
                    this.handleUnfreeze(values.type);
                }
                else if(visible_CreateTrainModal_Trial) {
                    this.handleTrial(values.type);
                }

                closeModal();
                changeCurrDiscipline(listDisciplines[values.type]);
            }
            else {
                console.log("error", err);
            }
        })
    };

    handleUnfreeze = (codeDisc) => {
        const {
            isAdmin,
            currentIdUser,
            useFrozenTraining,
            discCommunication,
            subsForDisc,

            startDate,
            endDate,
        
            addAmountTraining,
            editUseFrozenTraining,
            getAvailableInterval,
            getStudentsSchedule,
            getCountTrainingByDiscipline } = this.props;

        
        if(discCommunication && discCommunication[codeDisc] && subsForDisc[codeDisc] && discCommunication[codeDisc].idMaster){

            addAmountTraining(subsForDisc[codeDisc], useFrozenTraining)
                .then(() => message.success('Количество добавленных тренировок '+useFrozenTraining))
                .then(() => {
                    getStudentsSchedule(currentIdUser, startDate, endDate, codeDisc);
                    editUseFrozenTraining(currentIdUser, useFrozenTraining);
                    getCountTrainingByDiscipline(currentIdUser, codeDisc);
                })
                .catch(()=> message.success('Ошибка при добавлении тренировок'))
        }
        else {

            getAvailableInterval(startDate, endDate, codeDisc, isAdmin)
                .then(() => {
                    getStudentsSchedule(currentIdUser, startDate, endDate, codeDisc);
                    getCountTrainingByDiscipline(currentIdUser, codeDisc);
                })
        }
        
        
    }
    handleTrial = (codeDisc) => {
        const {
            isAdmin,
            currentIdUser,

            startDate,
            endDate,
        
            getAvailableInterval,
            getStudentsSchedule } = this.props;

        getAvailableInterval(startDate, endDate, codeDisc, isAdmin)
            .then(() => getStudentsSchedule(currentIdUser, startDate, endDate, codeDisc))
    }

    renderDisciplines = () => {
        const {
            listDisciplines, 
            visible_CreateTrainModal_Unfreeze,
            visible_CreateTrainModal_Trial,

            trialTrainingForDisciplines: discForTrial} = this.props;

        let radioDisciplinesArr = [];


            if(visible_CreateTrainModal_Unfreeze){
                Object.values(listDisciplines).forEach(item => {
                    radioDisciplinesArr.push(
                        <Radio value={item.code} key={'radio-' + item.name}>
                            {item.ruText}
                        </Radio>
                    )
                })
            }
            else if(visible_CreateTrainModal_Trial){
                function getFormatDiscipline(discObj){
                    let list = [];
                    for(let key in discObj){
                        if(discObj[key] === false) list.push(key)
                    }
                    return list
                }

                const formatDiscForTrial = getFormatDiscipline(discForTrial);

                formatDiscForTrial.forEach(key => {
                    radioDisciplinesArr.push(
                        <Radio 
                            key={'radio-' + listDisciplines[key].name}
                            value={listDisciplines[key].code} 
                        >
                            {listDisciplines[key].ruText}
                        </Radio>
                    )
                })

            }


        return radioDisciplinesArr;
    };

    render() {
        const {  trial, form } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form onSubmit={this.handleSubmit}
                className="CreateTrainModal">
                <p className="info">Для записи на {trial ? 'пробную ' : ''}тренировку выберите дисциплину</p>
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
