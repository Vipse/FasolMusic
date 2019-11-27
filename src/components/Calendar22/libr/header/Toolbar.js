import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux';

import { Select } from 'antd';
import moment from 'moment'

import * as actions from '../../../../store/actions'
import { navigate } from '../utils/constants'
import Button from '../../../Button'
import Arrow from '../../../Arrow'
import { getNewTrainingTime } from '../../../../containers/Schedule/shedule';

const Option = Select.Option;

class Toolbar extends React.Component {

  fillTrainingWeek = () => {
    const {
      currentIdUser: id,
      useFrozenTraining,
      currDiscipline,
      listNewSchedule,
    } = this.props;
    let trainingtime = {}

    for(let key in listNewSchedule){
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

    this.createAbonement(abonement)
  }

  createAbonement = (abonement) => {
    const {
      currentIdUser: id,
      currDiscipline,

      startDate,
      endDate,
    } = this.props;

    this.props.createAbonement(abonement)
    .then(() => {
      // this.props.onEditUseFrozenTraining(id, useFrozenTraining);
      this.props.getStudentsSchedule(id, startDate, endDate, currDiscipline.code)
    });
  }

  fillTrialTrainingWeek = () => {
    const {
      currentIdUser: id,
      currDiscipline,
      listNewSchedule,
    } = this.props;
    let trainingtime = {}


    for(let key in listNewSchedule){
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

    this.createAbonement(abonement)
  }

  changeSelectorDiscipline = (codeDisc) => {
    const { currentIdUser, startDate, endDate, listDisciplines } = this.props;
    const discObj = listDisciplines[codeDisc];

    this.props.changeCurrDiscipline(discObj);
    this.props.getStudentsSchedule(currentIdUser, startDate, endDate, codeDisc);
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


  getSaveFunction = () => {
    const {pushBtnUnfresh, pushBtnTrial} = this.props;

    if(pushBtnUnfresh && !pushBtnTrial) return this.fillTrainingWeek;
    else if(!pushBtnUnfresh && pushBtnTrial) return this.fillTrialTrainingWeek;
    else return () => {}
  }

  render() {
    const {
      listNewSchedule,
      isAdmin,
      listDisciplines,
      //
      dateChange,
      countTrainingDiscipline,
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
          <span className="rbc-toolbar-receptionCount">{countTrainingDiscipline}</span>
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
            onClick={this.getSaveFunction()}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
