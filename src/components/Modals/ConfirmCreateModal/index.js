import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'

//import Modal from '../../Modal'
import Content from './content'
import { Modal, message } from 'antd'


import './styles.css'
import { getNewTrainingTime } from '../../../containers/Schedule/shedule';

class ConfirmCreateModal extends React.Component {


    handleCreateAbonement = (abonement, textMessage) => {
        const {
            currentIdUser: id,
            currDiscipline,

            startDate,
            endDate,
        } = this.props;

        debugger
        this.props.createAbonement(abonement)
            .then(() => {
                // this.props.onEditUseFrozenTraining(id, useFrozenTraining);
                this.props.getStudentsSchedule(id, startDate, endDate, currDiscipline.code)
                this.props.setParamsId({ pushBtnUnfresh: false, pushBtnTrial: false });
                this.props.getCountTrainingByDiscipline(id, currDiscipline.code);
                this.props.getUseFrozenTraining(id)
                message.success(textMessage);
            })
            .catch(() => {
                message.info('Ошибка при создании');
            })
    }


    getSaveFunction = () => {
        const { pushBtnUnfresh, pushBtnTrial } = this.props;

        if (pushBtnUnfresh && !pushBtnTrial) return this.fillTrainingWeek;
        else if (!pushBtnUnfresh && pushBtnTrial) return this.fillTrialTrainingWeek;
        else return () => { }
    }

    fillTrainingWeek = () => {
        const {
            currentIdUser: id,
            useFrozenTraining,
            currDiscipline,
            listNewSchedule,
        } = this.props;
        let trainingtime = {}

        for (let key in listNewSchedule) {
            trainingtime = getNewTrainingTime(trainingtime, key, listNewSchedule[key])
        }

        const abonement = {
            idStudent: id,
            dateStart: Object.keys(listNewSchedule)[0],
            amount: useFrozenTraining,
            discipline: [currDiscipline.code],
            trainingtime,
            isNoTrial: true
        }

        this.handleCreateAbonement(abonement, 'Абонемент создан')
    }



    fillTrialTrainingWeek = () => {
        const {
            currentIdUser: id,
            currDiscipline,
            listNewSchedule,
        } = this.props;
        let trainingtime = {}


        for (let key in listNewSchedule) {
            trainingtime = getNewTrainingTime(trainingtime, key, listNewSchedule[key])
        }

        const abonement = {
            idStudent: id,
            dateStart: Object.keys(listNewSchedule)[0],
            amount: 1,
            discipline: [currDiscipline.code],
            trainingtime,
            isNoTrial: false
        }

        this.handleCreateAbonement(abonement, 'Пробная тренировка создана')
    }


    render(){
        const {
            visible_ConfirmCreateModal,
            hideConfirmCreateModal,
        } = this.props;
        const params = { onCancel: hideConfirmCreateModal };

        return (
            <Modal title={'Сообщение'}
                width={400}
                centered
                visible={visible_ConfirmCreateModal}
                onCancel={hideConfirmCreateModal}
                onOk={this.getSaveFunction()}
                okText={'Да'}
            >
                <Content
                    {...params}
                    {...this.props}
                />
            </Modal>
        )

    }
    
}


const mapStateToProps = state => {
    const {
      listNewSchedule,
      currentIdUser,
  
      pushBtnUnfresh,
      pushBtnTrial
    } = state.scheduleIdParams;
  
    return {
      currentIdUser,
      listNewSchedule,
      isAdmin: state.auth.mode === "admin",
      currDiscipline: state.abonement.currDiscipline,
      visible_ConfirmCreateModal: state.modal.visible_ConfirmCreateModal,
  
      startDate: state.training.startDate,
      endDate: state.training.endDate,
  
      // UX
      useFrozenTraining: state.student.useFrozenTraining,
  
      pushBtnUnfresh,
      pushBtnTrial
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        createAbonement: (data) => dispatch(actions.createAbonement(data)),

        getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),

        getCountTrainingByDiscipline: (currentIdUser, codeDisc) => dispatch(actions.getCountTrainingByDiscipline(currentIdUser, codeDisc)),
        getUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),

        hideConfirmCreateModal: () => dispatch(actions.hideConfirmCreateModal()),

        setParamsId: (params) => dispatch(actions.setParamsId(params)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmCreateModal);
