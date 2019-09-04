import PropTypes from 'prop-types'
import React from 'react'
import { navigate } from '../utils/constants'
import Button from '../../../Button'
import Arrow from '../../../Arrow'
import { Select } from 'antd';
import moment from 'moment'

const Option = Select.Option;

class Toolbar extends React.Component {

  static propTypes = {
  }

  changeSelectorDiscipline = (codeDisc) => {
    const {selectDisciplines, onChangeCurrDiscipline} = this.props;

    for(let el in selectDisciplines){
        if(selectDisciplines.hasOwnProperty(el)){
           if(selectDisciplines[el].code === codeDisc) {
             onChangeCurrDiscipline(selectDisciplines[el]);
             break;
           }  
        }
    }
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

  render() {
    const {
      min, 
      max,
      isAdmin,
      
      //
      messages, 
      label, 
      receptionNum,
      isNeedSaveIntervals, 
      fillTrainingWeek,
       selectDisciplines, 
       currDiscipline, 
       onChangeCurrDiscipline,
       notRedirectDiscipline,
      } = this.props;

    let optionDisciplines = [];
   
    for(let el in selectDisciplines){
        if(selectDisciplines.hasOwnProperty(el)){
            optionDisciplines.push(selectDisciplines[el]);
        }
    }

    return (
      <div className="rbc-toolbar">
        <Button
            className='btn-transfer-training'
            btnText="cегодня"
            size='small'
            type='dark-blue'
            onClick={this.navigate.bind(null, navigate.TODAY)}/>
        <Arrow type='dark-blue'
               onClickNext={this.navigate.bind(null, navigate.NEXT)}
               onClickPrev={this.navigate.bind(null, navigate.PREVIOUS)}/>

        <span className="rbc-toolbar-label">{this.getLabelToolbar()}</span>  
        {!isAdmin && <span className="rbc-toolbar-receptionCount">{this.props.countTrainingDiscipline}</span>}

        <div  className="rbc-toolbar-discipline">
          {(currDiscipline && !notRedirectDiscipline) ?
              <Select value={(currDiscipline.code)} style={{ width: 120 }} onChange={this.changeSelectorDiscipline} >
                  { optionDisciplines.map((el) =>  <Option value={el.code}>{el.ruText}</Option> )}
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

  navigate = action => {
    this.props.dateChange(action)
  }


}

export default Toolbar
