import React from 'react'
import Hoc from '../../hoc'
import Row from "../../components/Row";
import Col from "../../components/Col";
import PatientNearRecord from "../../components/PatientNearRecord";
import PatientAnalyzes from "../../components/PatientAnalyzes";
import PatientDoctor from "../../components/PatientDoctor";
import TopPanelPatient from "../../components/TopPanelPatient";
import TreatmentTable from "../../components/TreatmentTable";
import NewFreeVisitByPatient from "../../components/NewFreeVisitByPatient";
const PatientPage = props => {
    const gotoHandler = (id) => {
        props.onSelectPatient(id);
        props.history.push('/app/doctor'+id);
    };
    return (
        <Hoc>
            <Row>
                <Col>
                    <TopPanelPatient
                        data={[
                            {
                                first: true,
                            }, {
                                className: "",
                                num: props.userInfoShort.PatientAge || '—',
                                text: "возраст",
                                notChangeable: true,
                            }, {
                                className: "",
                                num: props.userInfoShort.PatientWeight || '—',
                                text: "вес",
                            }, {
                                className: "",
                                num: props.userInfoShort.PatientHeight || '—',
                                text: "рост",
                            }, {
                                className: "",
                                num: props.userInfoShort.PatientPressure || '—',
                                text: "давление",
                                doubleValueInput: true,
                            }, {
                                className: "",
                                num: props.userInfoShort.PatientPulse || '—',
                                text: "пульс",
                            },
                        ]}
                        onSave={props.onSendUserPoleValue}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={10} xxl={6} className='section' height={100}>
                    <PatientNearRecord
                        style={{height: 485}}
                        data={props.nearVisits}
                        onGoto={() => console.log('click')}
                        redirect={() => props.history.push('/app/calendar')}
                        nearVisitsLoaded = {props.nearVisitsLoaded}
                        cancelAppByPatient = {props.cancelAppByPatient}
                    />
                </Col>
                <Col xs={14} xxl={8} className='section'>
                    <PatientAnalyzes data={
                        [{
                            comeDate: true,
                            analyzesDate: "10 января",
                            analyzesType: "blood",
                            analyzesText: "Общий анализ крови (без лейкоцитарной формулы и СОЭ) (Complete Blood Count, CBC)",
                        }, {
                            analyzesDate: "10 января",
                            analyzesType: "ultrasound",
                            analyzesText: "Общий анализ крови (без лейкоцитарной формулы и СОЭ) (Complete Blood Count, CBC)",
                        }, {
                            analyzesDate: "10 января",
                            analyzesType: "heart",
                            analyzesText: "Общий анализ крови (без лейкоцитарной формулы и СОЭ) (Complete Blood Count, CBC)",
                        }, {
                            analyzesDate: "10 января",
                            analyzesType: "heart",
                            analyzesText: "Общий анализ крови (без лейкоцитарной формулы и СОЭ) (Complete Blood Count, CBC)",
                        }, {
                            analyzesDate: "10 января",
                            analyzesType: "heart",
                            analyzesText: "Общий анализ крови (без лейкоцитарной формулы и СОЭ) (Complete Blood Count, CBC)",
                        }]
                    }/>
                </Col>
                <Col xs={24} xxl={10} className='section'>
                    <PatientDoctor
                        data = {props.doctors}
                        onGoto={gotoHandler}
                        redirect={() => props.history.push('/app/doctors')}
                        intervals={props.intervals}
                        onGetAllDocIntervals={props.onGetAllDocIntervals}
                        onGetIntervalForDate={props.onGetIntervalForDate}
                        availableIntervals={props.availableIntervals}
                        isUser={true}
                        onAddVisit = {props.onAddVisit}
                        isReceptionRecorded={props.isReceptionRecorded}
                        receptionRecordedID={props.receptionRecordedID}
                        myDoctorsLoaded={props.myDoctorsLoaded}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TreatmentTable
                        isUser={props.isUser}
                        redirect={() => props.history.push('/app/treatment')}
                        data={props.completedApps ? props.completedApps.result : []}
                        dataCount = {props.completedApps ? props.completedApps.count : 0}
                        onGoto={gotoHandler}
                        onGotoChat={(id) => console.log(id)}
                        getCompletedApps ={props.getCompletedApps}
                        onSubmitReview={props.onSubmitReview}
                        makeArchiveOfFiles = {props.makeArchiveOfFiles}
                    />
                </Col>
            </Row>

        </Hoc>
    )
}

export default PatientPage;
