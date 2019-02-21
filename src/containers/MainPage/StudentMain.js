import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import NearTrainings from "../../components/NearTrainings";

import Hoc from '../../hoc'
import LastTrainings from "../../components/LastTrainings";
import MyCoach from '../../components/MyCoach';
import VK, { CommunityMessages } from 'react-vk';

class StudentMain extends React.Component{
	constructor(props) {
		super(props);
    }

    state = {
        nearTrainings: [],
        lastTrainings: [],
        myCoaches: [],
        widget: null,
        id: null
          
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.nearTraining !== this.props.nearTraining)
            this.setState({nearTrainings: this.prepareNearTrainings()});
        if (prevProps.lastTrainings !== this.props.lastTrainings)
            this.setState({lastTrainings: this.prepareLastTrainings()});
        if (prevProps.myCoaches !== this.props.myCoaches)
            this.setState({myCoaches: this.prepareMyCoaches()});
    }

    prepareNearTrainings = () => {
	    const {nearTraining, selectors} = this.props;

        if (selectors.discipline && Array.isArray(nearTraining)) {
            return nearTraining.map((item) => {
                return {
                    name: item.fioMaster,
                    avatar: item.avatarMaster,
                    start: +item.start * 1000,
                    end: +item.start * 1000 + 3600000,
                    discipline: item.disciplineSubscription.length ?
                        selectors.discipline.find(discipline => discipline.id === +item.disciplineSubscription[0]).nameRus : null,
                    idProfile: item.idMaster,
                    idTraining: item.id,
                    isTrial: item.trial,
                    isComplete: item.isComplete
                }
            });
        }
    };

    prepareLastTrainings = () => {
        const {lastTrainings, selectors} = this.props;

        if (selectors.discipline) {
            return lastTrainings.map((item) => {
                return {
                    name: item.fioMaster,
                    date: +item.start * 1000,
                    discipline: item.disciplineMaster.length ? selectors.discipline.find(discipline => discipline.id === +item.disciplineMaster[0]).nameRus : null,
                    avatar: item.avatarMaster,
                    homework: item.homework,
                    idProfile: item.idMaster
                };
            }).reverse();
        }
    };

    prepareMyCoaches = () => {
        const {myCoaches, selectors} = this.props;

        if (selectors.discipline) {
            return myCoaches.map((item) => {
                return {
                    id: item.idMaster,
                    profileAvatar: item.avatar,
                    online: true,
                    disciplines: item.disciplines,
                    name: item.name,
                    lastMessage: "Последнее сообщение, asdas Lorem Ipsum is simply dummy text of the printing"+
                        " and typesetting industry. Lorem Ipsum has been the industry's "
                };
            });
        }
    };

    gotoHandler = (id) => {
        this.props.onSelectPatient(id);
        this.props.history.push('/app/coach'+id);
    };

    render(){
        const {nearTrainings, lastTrainings, myCoaches} = this.state;
        const {goToChat} = this.props;

        return (
            <Hoc>
                        <Row>
                            <Col span={24} className='section'>
                                <TopPanel  
                                    {...this.props.docTodayInfo}
                                    nextTrainingTime = {this.props.nextTrainingTime}
                                    myCoachOrStudents = {this.props.myCoachOrStudents}
                                    isStudent={true}
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                                <NearTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    goToChat = {goToChat}
                                    openNearTrains={() => this.props.history.push('/app/schedule')}
                                    data={nearTrainings}
                                />
                            </Col>
                            <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                                <LastTrainings
                                    onGoto={(val) => this.gotoHandler(val)}
                                    openLastTrains={() => this.props.history.push('/app/homework')}
                                    data={lastTrainings}
                                    isStudent={true}
                                />
                            </Col>

                            <Col xs={14} xxl={8} md={12} sm={8} className='section'>
                                <MyCoach
                                    goToChat = {goToChat}
                                    onGoto={(val) => this.gotoHandler(val)}
                                    data = {myCoaches}
                                />
                            </Col>
                        </Row>
                        
                        <div id="bugfix">
                            <div id="vk_community_messages">
                                <VK apiId={120172845} >
                                    <CommunityMessages
                                        groupId={120172845}
                                        options={{onCanNotWrite: reason => console.log(reason)}}
                                        onMount={(widget, id) => {
                                            this.setState({ widget, id });
                                        }}
                                    />
                                </VK>
                            </div>
                            
                        </div>
                        
                    </Hoc>
        )
    }
}

export default StudentMain;
