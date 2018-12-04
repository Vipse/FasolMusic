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
		let link = this.props.mode==="user"?"/app/doctor":"/app/patient";
		this.props.history.push(link+id);
	};

    componentDidMount() {
    
        this.props.onGetAbonements2();
    }

    render(){

        console.log('this.props.allAbonements2 :', this.props.allAbonements2);
        let arrAbonement = [];

        if(this.props.allAbonements2){
            let {subscriptions} = this.props.allAbonements2;
            let max = subscriptions.length;
            for(let i = 0; i < max; i++){
                for(let j = 0; j < subscriptions[i].training.length; j++){

                    for(let a = 0; a < apiTrainers.length; a++){
                        console.log('apiTrainers[a].idMaster :',  apiTrainers[a].idMaster);
                        console.log('subscriptions[i].training[j].idMaster :',  subscriptions[i].training[j].idMaster);

                        if(String(apiTrainers[a].idMaster) === String(subscriptions[i].training[j].idMaster)){



                            arrAbonement.push(
                                {
                                    date: subscriptions[i].training[j].start ,
                                    name: apiTrainers[a].fio,
                                    discipline: subscriptions[i].discipline,
                                    trainingRecord: "http://vk.com",
                                    homework: "сделать кучу вещей, сыграть на гитарке",
                                    files: [],
                                   
                                })
                            console.log("AAAA")
                            a = Infinity;
                        }
                    }

                    // arrAbonement.push(
                    //     {
                    //         date: subscriptions[i].training[j].start ,
                    //         name: fio,
                    //         discipline: subscriptions[i].discipline,
                    //         trainingRecord: "http://vk.com",
                    //         homework: "сделать кучу вещей, сыграть на гитарке",
                    //         files: [],
                    //     })
                }
            }
        }

        return (
            <Hoc>
            	<Row>
            		<Col span={24} className='section'>
                        <HomeworkList

                            onGoto={this.gotoHandler}
                            isUser={true}//{this.props.mode === "user"}
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
	}
};

const mapDispatchToProps = dispatch => {
	return {
        onGetTreatments: (obj) => dispatch(actions.getPaginationTreatments(obj)),
        onAddFiles: (file, id) => dispatch(actions.addFileToApp(file, id)),
        makeArchiveOfFiles: (files) => dispatch(actions.makeArchiveOfFiles(files)),

        onGetAbonements2: (idStudent) => dispatch(actions.getAbonements2(idStudent)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
