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

    // следующая тренировка - return 15234500000
    selectFirstTraining = () => {
        const {nearTraining} = this.props;
        
        if(Array.isArray(nearTraining) && nearTraining.length) {
            return nearTraining[0].start * 1000;
        }
        return null;
    }

    render(){
        const { allAbonements, goToChat } = this.props;
        console.log('myCoach :', myCoach);

        let myCoach = [];
        for(let i = 0; i < this.props.myCoach.length; i++){
            if(this.props.myCoach[i]){
                myCoach.push(this.props.myCoach[i])
            }
        }


    // if(this.props.allAbonements)
    //     for(let i = 0; i < this.props.allAbonements.subscriptions.length; i++){
    //         for(let j = 0; j < 5; j++){ debugger;
    //             near.push({
    //                 start: this.props.allAbonements.subscriptions[i].training[j],
    //                 end: this.props.allAbonements.subscriptions[i].training[j],
    //                 discipline: "Вокал",
    //                 name: this.props.allAbonements.subscriptions[i].training[j]
    //             })
    //         }
    //         break;
    //     }


    return (
            <Hoc>
                        <Row>
                            <Col span={24} className='section'>
                                <TopPanel  
                                    {...this.props.docTodayInfo}
                                    nextTraining = {this.selectFirstTraining()}
                                    />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={14} xxl={7} className='section'>
                                <NearTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
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
                                <MyCoach
                                    goToChat = {goToChat}
                                    onGoto={(val) => this.gotoHandler(val)}
                                    data = { (Array.isArray(myCoach)) ? myCoach.map((el) => {
                                        if(el)
                                        return {
                                            id: el.idMaster,
                                            profileAvatar: el.avatar,
                                            online: true,
                                           // discipline: el.disciplines.map((elem) => elem.discipline),
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