import React from 'react'
import Row from "../../components/Row";
import Col from "../../components/Col";
import TopPanel from "../../components/TopPanel";
import Reviews from "../../components/Reviews";
import TreatmentTable from "../../components/TreatmentTable";
import NewVisitModal from "../../components/NewVisitModal";
import TableNoHead from "../../components/TableNoHead";
import CancelVisitModal from "../../components/CancelVisitModal";
import Icon from "../../components/Icon";

import Hoc from '../../hoc'
import HistoryReceptionsTabs from "../../components/HistoryReceptionsTabs";

const DoctorPage = props => {

    const gotoHandler = (id) => {
		props.onSelectPatient(id);
		props.history.push('/app/patient'+id);
	}
    return (
        <Hoc>
					<Row>
						<Col span={24} className='section'>
							<TopPanel  {...props.docTodayInfo}/>
						</Col>
					</Row>

					<Row>
						<Col xs={14} xxl={7} className='section'>
							<TableNoHead data={props.visits}
										onGoto={(val) => gotoHandler(val)}
										onBegin={(val) => {
											props.onSelectReception(val)
											props.history.push('/app/chat')
										}}
										onCancel={props.showCancel}
										onAdd = {props.onAdd}
							/>
						</Col>
						<Col xs={14} xxl={8} className='section'>
							<Reviews data={props.reviews}
									title="Домашние задания"
									 numToDisplay = {7}
									 onGoto={(val) => gotoHandler(val)}
									 onGotoChat={(id) => {
                                        props.onSelectTretment(id);
                                        props.history.push('/app/chat');
                                    }}
									 isDoctor={true}
									 redirect={() => {props.history.push('/app/reviews');}}/>
						</Col>

						<Col xs={14} xxl={9} className='section'>
							<Reviews data={props.reviews}
								title="Мои коучи"
								numToDisplay={7}
								onGoto={(val) => gotoHandler(val)}
								onGotoChat={(id) => {
									props.onSelectTretment(id);
									props.history.push('/chat');
								}}
								isDoctor={true}
								redirect={() => { props.history.push('/reviews'); }} 
						extra={<a className="schedule-all-link"> <span className="span-all-queue">Весь список</span></a>}
								/>
						</Col>
					</Row>
					<NewVisitModal visible={props.addModal}
									date={new Date()}
									isChoosebleTime={true}
								    intervals={props.intervals}
									patients={props.patients}
									onCancel={props.closeAdd}
									onSave = {props.onSaveNewVisit}
					/>
					<CancelVisitModal visible={props.cancelModal}
									onGoto={() => {}}
									onCancel={props.closeCancel}
									onSave={props.saveCancel}
					/>
                </Hoc>
    )
}

export default DoctorPage;
