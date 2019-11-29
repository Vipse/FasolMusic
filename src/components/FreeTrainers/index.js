import React from 'react';
import { connect } from 'react-redux'

import FreeTrainersItem from "../FreeTrainersItem";
import Card from '../Card'
import Button from '../Button';
import * as actions from '../../store/actions'

import './style.css'
import '../../icon/style.css'

class FreeTrainers extends React.Component {

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => (
            <FreeTrainersItem {...item}
                key={index}
                onGotoPage={this.props.onGotoPage}
                setChoosenTrainer={this.setChoosenTrainer}
            />)
        );
    };

    setChoosenTrainer = (objTrainer) => {
        const {listNewSchedule, pushBtnTrial, pushBtnUnfresh} = this.props;

        function addingTrainerToListSchedule(objTrainer){
            let listNew = {...listNewSchedule}
            for(let key in listNew){
                listNew[key].idMaster = objTrainer.id;
                listNew[key].masterFio = objTrainer.name;
            }
            return listNew
        }

        if(pushBtnTrial && !pushBtnUnfresh){
            const listNew = addingTrainerToListSchedule(objTrainer)      
            this.props.setParamsId({listNewSchedule: listNew})
            this.props.showConfirmCreateModal()
        }

        this.props.setParamsId({ clickedTrainer: objTrainer })
    }

    selectAnyTrainer = () => {
        const { freeTrainers, pushBtnTrial } = this.props

        const min = 0;
        const max = freeTrainers.length - 1;
        let rand = min + Math.random() * (max + 1 - min);
            rand = Math.floor(rand);

        const obj = {
            id: freeTrainers[rand].id,
            name: freeTrainers[rand].name
        }
        if(pushBtnTrial){
            this.props.showConfirmCreateModal()
        }
        this.setChoosenTrainer(obj)
        
    }

    render() {
        const { freeTrainers } = this.props;

        return (
            <div className='my-free-coach' id="my-coach-wrapper">

                <Card title="Выбери коуча">
                    <Button
                        btnText='Выбрать любого'
                        size='default'
                        type='border-pink'
                        className="header-btn header-btn-transfer my-coach-any"
                        onClick={this.selectAnyTrainer}
                    />

                    <div className="scroll-trainers">
                        <div>
                            {Array.isArray(freeTrainers) && freeTrainers.length ?
                                this.studentsRender(freeTrainers)
                                : 
                                <div className='noStudents'>Коучей нет</div>}
                        </div>
                    </div>

                    {/*<div className="freetrainers-spinner">
                            <Spinner isInline={true} size='large'/>
                                    </div>} */}

                </Card>

            </div>
        )
    }
}

const mapStateToProps = state => {
    const {
        listNewSchedule,
        pushBtnUnfresh,
        pushBtnTrial
    } = state.scheduleIdParams;

    return {
        freeTrainers: state.scheduleIdParams.fullInfoMasters,

        listNewSchedule,
        pushBtnTrial,
        pushBtnUnfresh
    }
}

const mapDispatchToProps = dispatch => {
    return {
        showConfirmCreateModal: () => dispatch(actions.showConfirmCreateModal()),

        setParamsId: (params) => dispatch(actions.setParamsId(params)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FreeTrainers);
