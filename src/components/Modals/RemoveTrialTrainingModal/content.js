import React from 'react';
import { Form , Button, message} from 'antd';
import history from '../../../store/history'


const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }


    removeTrialTraining = () => {
        const {
            currentIdUser, 
            currDiscipline, 
            crossCurrentIdTrialTraining: idTraining, 

            startDate,
            endDate,
            
            isAdmin} = this.props;

        this.props.removeTrialTraining(idTraining, isAdmin)
        .then(() => {
            message.success('Пробная тренировка удалена')
            this.props.getStudentsSchedule(currentIdUser, startDate, endDate, currDiscipline.code)
            this.props.getTrainingsTrialStatus(currentIdUser)
            this.props.getTrainingTrialStatusByDiscipline(currDiscipline.code, currentIdUser)
        })
        .catch((e) => {
            console.log("e", e)
            message.info('Ошибка при удалении пробной тренировки')
        })

        this.props.onCancel();
    }


    render() {

        return (
            <div className="remove-modal">
                <div className="remove-modal-btn">
                    <Button 
                        onClick={() => {
                            this.removeTrialTraining()
                           // this.props.onRemoveTrialTraining(this.deleteIdTraining, this.props.isAdmin)
                            //    .then(this.props.onGetTrainingsTrialStatus(this.id))
                            //    .then(this.props.onGetTrainingTrialStatusByDiscipline(this.props.currDiscipline.code, this.id))
                            //.then(() => this.props.onGetAbonementsFilter(id, currDiscipline, isAdmin))

                            //this.setState({ modalRemoveTrialTraining: false });
                        }}
                        type='yellow' >Удалить тренировку</Button>
                </div>
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
