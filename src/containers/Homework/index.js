import React from 'react'
import {connect} from 'react-redux';

import Row from "../../components/Row";
import Col from "../../components/Col";
import HomeworkList from "../../components/HomeworkList";

import Hoc from '../../hoc'

import * as actions from '../../store/actions'

import './styles.css'
import {apiTrainers} from '../Schedule/mock-data'

class Homework extends React.Component{
    state = {
        cancelModal: false,
        addModal: false,
        isNewFreeVisitVisible: false,
    };


    gotoHandler = (id) => {
		this.props.onSelectPatient(id);
		let link = this.props.mode==="student"?"/app/doctor":"/app/patient";
		this.props.history.push(link+id);
	};

    componentDidMount() {
        
        this.props.onGetAbonements2(this.props.id);
        this.props.onGetMasterList();
    }

    render(){

        let arrAbonement = [];
        const {trainerList} = this.props;

        if(this.props.allAbonements2){
            let {subscriptions} = this.props.allAbonements2;
            let max = subscriptions.length;
            for(let i = 0; i < max; i++){
                for(let j = 0; j < subscriptions[i].training.length; j++){

                    for(let a = 0; trainerList && a < trainerList.length; a++){

                        if(String(trainerList[a].idMaster) === String(subscriptions[i].training[j].idMaster)){

                            arrAbonement.push(
                                {
                                    date: subscriptions[i].training[j].start ,
                                    name: trainerList[a].name,
                                    discipline: subscriptions[i].discipline,
                                    trainingRecord: "http://vk.com",
                                    homework: "сделать кучу вещей, сыграть на гитарке",
                                    files: [],
                                   
                                })
                            a = Infinity;
                        }
                    }

                }
            }
        }

        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList

                            onGoto={this.gotoHandler}
                            isUser={true}//{this.props.mode === "student"}
                            onAddFiles = {this.props.onAddFiles}
                            makeArchiveOfFiles = {this.props.makeArchiveOfFiles}
                            trainings={arrAbonement}
                        />
            		</Col>
            	</Row>
            </Hoc>
        )
    }
}

const mapStateToProps = state => {
	return {
        allAbonements2: state.abonement.allAbonements2, // и интервалы
        mode: state.auth.mode,
        id: state.auth.id,
        trainerList: state.trainer.trainerList,
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onGetTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files)),

        onGetAbonements2: (idStudent) => dispatch(actions.getAbonements2(idStudent)),
        onGetMasterList: (discipline) => dispatch(actions.getMasterList(discipline)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
