import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux';

import { Select } from 'antd';
import moment from 'moment'

import * as actions from '../../../../store/actions'
import { navigate } from '../utils/constants'
import Button from '../../../Button'
import Arrow from '../../../Arrow'

const Option = Select.Option;

class Toolbar extends React.Component {

  static propTypes = {
  }

  changeSelectorDiscipline = (codeDisc) => {
    const {listDisciplines, changeCurrDiscipline} = this.props;
    const discObj = listDisciplines[codeDisc];

    changeCurrDiscipline(discObj);
  }

  getLabelToolbar = () => {
    const { min } = this.props;

    const startDate = moment(+min).startOf('week')
    const endDate = moment(+min).endOf('week')

    if (startDate.get('month') == endDate.get('month')){
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
      min, 
      max,
      isAdmin,
      listDisciplines,
      //
      dateChange,
      countTrainingDiscipline,
      //
      isNeedSaveIntervals, 
      fillTrainingWeek, 
       currDiscipline, 
       notRedirectDiscipline,
      } = this.props;

    return (
      <div className="rbc-toolbar">
        <Button
            className='btn-transfer-training'
            btnText="cегодня"
            size='small'
            type='dark-blue'
            onClick={() => dateChange(navigate.TODAY)}/>
        <Arrow type='dark-blue'
               onClickNext={() => dateChange(navigate.NEXT)}
               onClickPrev={() => dateChange(navigate.PREVIOUS)}/>

        <span className="rbc-toolbar-label">{this.getLabelToolbar()}</span>  
        {!isAdmin && 
          <span className="rbc-toolbar-receptionCount">{countTrainingDiscipline}</span>
        }

        <div  className="rbc-toolbar-discipline">
          {(currDiscipline && !notRedirectDiscipline) ?
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
        
        
        { isNeedSaveIntervals ?  
              <Button
              btnText={'Сохранить'}
              size='small'
              type='yellow-black'
              onClick={fillTrainingWeek}
              /> : null
        }

      </div>
    )
  }

  
}


const mapStateToProps = state => {
  return {
    listDisciplines: state.abonement.listDisciplines,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeCurrDiscipline: (disc)=> dispatch(actions.changeCurrDiscipline(disc)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
