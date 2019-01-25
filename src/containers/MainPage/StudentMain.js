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
import MyCoach from '../../components/MyCoach';

class StudentMain extends React.Component{
	constructor(props) {
		super(props);
    }
    
    gotoHandler = (id) => {
		this.props.onSelectPatient(id);
		this.props.history.push('/app/coach'+id);
    }


    render(){
        const { allAbonements, goToChat, myCoachOrStudents } = this.props;

        let myCoaches = [];
        for(let i = 0; i < myCoachOrStudents.length; i++){
            if(myCoachOrStudents[i]){
                myCoaches.push(myCoachOrStudents[i])
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
                                    />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={14} xxl={7} className='section'>
                                <NearTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    openNearTrains={() => this.props.history.push('/app/schedule')}
                                    data={[]}

                                />
                            </Col>
                            <Col xs={14} xxl={8} className='section'>
                                <LastTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    openLastTrains={() => this.props.history.push('/app/homework')}
                                    data={[]}
                                />
                            </Col>

                            <Col xs={14} xxl={9} className='section'>
                                <MyCoach
                                    goToChat = {goToChat}
                                    onGoto={(val) => this.gotoHandler(val)}
                                    data = { (Array.isArray(myCoaches)) ? myCoaches.map((el) => {
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

export default StudentMain;
