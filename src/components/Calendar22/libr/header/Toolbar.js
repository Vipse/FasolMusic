import PropTypes from 'prop-types'
import React from 'react'
import { navigate } from '../utils/constants'
import Button from '../../../Button'
import Arrow from '../../../Arrow'
import { Select } from 'antd';

const Option = Select.Option;

class Toolbar extends React.Component {

  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
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

  render() {
    let { messages, 
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

    console.log('notRedirectDiscipline :', notRedirectDiscipline);
    return (
      <div className="rbc-toolbar">
        <Button
            btnText={messages.today}
            size='small'
            type='dark-blue'
            onClick={this.navigate.bind(null, navigate.TODAY)}/>
        <Arrow type='dark-blue'
               onClickNext={this.navigate.bind(null, navigate.NEXT)}
               onClickPrev={this.navigate.bind(null, navigate.PREVIOUS)}/>

        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-toolbar-receptionCount">{this.props.countTrainingDiscipline}</span>


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
    this.props.onNavigate(action)
  }


}

export default Toolbar
