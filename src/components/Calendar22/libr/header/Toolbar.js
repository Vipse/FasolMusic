import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux';

import { Select, message } from 'antd';
import moment from 'moment'

import * as actions from '../../../../store/actions'
import { navigate } from '../utils/constants'
import Button from '../../../Button'
import Arrow from '../../../Arrow'
import { getNewTrainingTime } from '../../../../containers/Schedule/shedule';

const Option = Select.Option;

class Toolbar extends React.Component {

  changeSelectorDiscipline = (codeDisc) => {
    const { currentIdUser, mode, isAdmin, startDate, endDate, listDisciplines } = this.props;
    const discObj = listDisciplines[codeDisc];

   

    if(mode === 'student' || isAdmin){
      this.props.getStudentsSchedule(currentIdUser, startDate, endDate, codeDisc);
      
    }
    else if(mode === 'master'){
      this.props.getTrainerTraining(currentIdUser, startDate, endDate, codeDisc);
    }

    this.props.changeCurrDiscipline(discObj);
    this.props.getCountTrainingByDiscipline(currentIdUser, codeDisc)
  }

  getLabelToolbar = () => {
    const { min } = this.props;

    const startDate = moment(+min).startOf('week')
    const endDate = moment(+min).endOf('week')

    if (startDate.get('month') == endDate.get('month')) {
      return startDate.format('MMM D') + ' - ' + endDate.format('D')
    }
    else {
      return startDate.format('MMM D') + ' - ' + endDate.format('MMM D')
    }
  }

  navigate = (action) => {
    this.props.dateChange(action)
  }



  render() {
    const {
      listNewSchedule,
      isAdmin,
      listDisciplines,
      //
      dateChange,
      countTrainingDiscipline: count,
      //
      currDiscipline,
      freeInterval
    } = this.props;


    const isBlockSelector = !!freeInterval.length;

    return (
      <div className="rbc-toolbar">
        <Button
          className='btn-transfer-training'
          btnText="cегодня"
          size='small'
          type='dark-blue'
          onClick={() => dateChange(navigate.TODAY)} />
        <Arrow type='dark-blue'
          onClickNext={() => dateChange(navigate.NEXT)}
          onClickPrev={() => dateChange(navigate.PREVIOUS)} />

        <span className="rbc-toolbar-label">{this.getLabelToolbar()}</span>
        {!isAdmin &&
          <span className="rbc-toolbar-receptionCount">{count ? count : 0}</span>
        }

        <div className="rbc-toolbar-discipline">
          {(currDiscipline && !isBlockSelector) ?
            <Select
              style={{ width: 120 }}
              value={currDiscipline.code}
              onChange={this.changeSelectorDiscipline}
            >
              {Object.values(listDisciplines).map(el => (
                <Option value={el.code}>{el.ruText}</Option>
              ))}

            </Select>
            : <span className="rbc-toolbar-label">{currDiscipline ? currDiscipline.ruText : ''}</span>}
        </div>


        {Object.keys(listNewSchedule).length ?
          <Button
            btnText={'Сохранить'}
            size='small'
            type='yellow-black'
            onClick={this.props.showConfirmCreateModal } //getSaveFunction()
          /> : null
        }

      </div>
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
    mode: state.auth.mode,

    startDate: state.training.startDate,
    endDate: state.training.endDate,

    listDisciplines: state.abonement.listDisciplines,
    freeInterval: state.scheduleIdParams.freeInterval,

    // UX
    useFrozenTraining: state.student.useFrozenTraining,
    countTrainingDiscipline: state.training.countTrainingDiscipline,

    pushBtnUnfresh,
    pushBtnTrial
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createAbonement: (data) => dispatch(actions.createAbonement(data)),

    getStudentsSchedule: (id, start, end, disc) => dispatch(actions.getStudentsSchedule(id, start, end, disc)),
    changeCurrDiscipline: (disc) => dispatch(actions.changeCurrDiscipline(disc)),
    getCountTrainingByDiscipline: (currentIdUser, codeDisc) => dispatch(actions.getCountTrainingByDiscipline(currentIdUser, codeDisc)),
    getUseFrozenTraining: (idStudent) => dispatch(actions.getUseFrozenTraining(idStudent)),

    //trainer
    getTrainerTraining: (id, start, end, currDiscipline) => dispatch(actions.getTrainerTraining(id, start, end, currDiscipline)),

    setParamsId: (params) => dispatch(actions.setParamsId(params)),

    showConfirmCreateModal: () => dispatch(actions.showConfirmCreateModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
