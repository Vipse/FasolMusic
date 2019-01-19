import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import NearTrainings from "../../components/NearTrainings";
import Icon from "../../components/Icon";

import Hoc from '../../hoc'
import LastTrainings from "../../components/LastTrainings";
import moment from 'moment'
import MyStudents from './../../components/MyStudents/index';

class CouchMain extends React.Component{
	constructor(props) {
		super(props);
    }
    
    gotoHandler = (id) => {
		this.props.onSelectPatient(id);
		this.props.history.push('/app/student'+id); // надо student
    }

    // следующая тренировка - return 15234500000
    selectFirstTraining = () => {
        const {allAbonements} = this.props;
        let arrFirst = [];

        if(!allAbonements) return arrFirst;

        allAbonements.subscriptions.forEach(el => {
            if(el && el.hasOwnProperty('training') && Array.isArray(el.training) && el.training.length && el.training.status){
                arrFirst.push(el.training[0]);
            }
        });

        const min = arrFirst.reduce((min, el) => {
            
            return (min > (+el.start)) ? +el.start : min
        }, Infinity);  
        
        console.log('1', moment(min*1000))
        if(min === Infinity) return 0;
        return min;
    }

    render(){
        const { allAbonements, myCoachOrStudents, postTraining } = this.props;

        let myCoach = [];
        for(let i = 0; i < myCoachOrStudents.length; i++){
            if(myCoachOrStudents[i]){
                myCoach.push(myCoachOrStudents[i])
            }
        }

    return (
            <Hoc>
                        <Row>
                            <Col span={24} className='section'>
                                <TopPanel  
                                    {...this.props.docTodayInfo}
                                    nextTrainingTime = {this.props.nextTrainingTime}
                                    myCoachOrStudents = {this.props.myCoachOrStudents}
                                    todayTraining = {this.props.todayTraining}
                                    />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={14} xxl={7} className='section'>
                                <NearTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    openNearTrains={() => this.props.history.push('/app/schedule')}
                                   // data = //{postTraining}
                                    data={[
                                        {
                                            profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                            online: true,
                                            date: 1540813960,
                                            discipline: "Вокал",
                                            name: "Петров василий чвасильевич",
                                            homework: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
                                                "printing and typesetting industry. Lorem Ipsum has been the industry's " +
                                                "standard dummy text ever since the 1500s, when a"
                                        },
                                        {
                                            profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                            online: true,
                                            discipline: "Вокал",
                                            name: "Петров ВАСКЕ чвасильевич",
                                            homework: ''
                                        }
                                    ]}
                                                               

                                />
                            </Col>
                            <Col xs={14} xxl={8} className='section'>
                                <LastTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    openLastTrains={() => this.props.history.push('/app/homework')}
                                    data={[
                                        {
                                            profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                            online: true,
                                            date: 1540813960,
                                            discipline: "Вокал",
                                            name: "Петров василий чвасильевич",
                                            homework: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the " +
                                                "printing and typesetting industry. Lorem Ipsum has been the industry's " +
                                                "standard dummy text ever since the 1500s, when a"
                                        },
                                        {
                                            profileAvatar: 'https://pp.userapi.com/c850020/v850020281/649d7/mOIcjm823rA.jpg',
                                            online: true,
                                            discipline: "Вокал",
                                            name: "Петров ВАСКЕ чвасильевич",
                                            homework: ''
                                        }
                                    ]}

                                />
                            </Col>

                            <Col xs={14} xxl={9} className='section'>
                                <MyStudents
                                    onGoto={(val) => this.gotoHandler(val)}
                                    data = { (Array.isArray(myCoach)) ? myCoach.map((el) => {
                                        if(el)
                                        return {
                                            id: el.idMaster,
                                            profileAvatar: el.avatar,
                                            online: true,
                                            disciplines: el.disciplines,
                                            name: el.name,
                                            lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the printing"+
                                                        " and typesetting industry. Lorem Ipsum has been the industry's "
                                        }
                                    }) : [] }

                                />
                            </Col>
                        </Row>

                    </Hoc>
        )
                            }
}

export default CouchMain;
