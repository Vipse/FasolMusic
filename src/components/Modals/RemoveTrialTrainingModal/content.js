import React from 'react';
import { Form , Button, message} from 'antd';
import history from '../../../store/history'


const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }


    remove = () => {
        const {
            currentIdUser: id, 
            currDiscipline, 
            crossCurrentIdTrialTraining: idTraining, 

            startDate,
            endDate,
            
            isAdmin} = this.props;

        this.props.removeTrialTraining(idTraining, isAdmin)
        .then(() => {
            message.success('Пробная тренировка удалена')
            this.props.onCancel();
            this.props.getStudentsSchedule(id, startDate, endDate, currDiscipline.code)
            this.props.getTrainingsTrialStatus(id)
            this.props.getTrainingTrialStatusByDiscipline(currDiscipline.code, id)
            this.props.getCountTrainingByDiscipline(id, currDiscipline.code)
            
        })
        .catch((e) => {
            console.log("e", e)
            message.info('Ошибка при удалении пробной тренировки')
        })

        
    }


    render() {

        return (
            <div className="remove-modal">
                <div className="remove-modal-btn">
                    <Button 
                        onClick={this.remove}
                        type='yellow' >Удалить тренировку</Button>
                </div>
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
