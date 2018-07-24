export {
    getDocPatients,
    getPatientDoctors,
    getNotDocPatients,
    clearNotDocPatients,
    addPatient,
    addDoctor,
    removePatient,
    getDateInterval,
    getDateIntervalWithoutMakingApp,
    setReception,
    setReceptionByPatient,
    selectPatient,
    unselectPatient,
    getNotPatientDoctors,
    clearNotPatientDoctors,
    getSelectedPatientInfo,
    
    sendMessage,
} from './patients';

export {
    getAllReviews,
    putCommentAnswer,
    
} from './reviews';

export {
    selectEvent,
    deleteEvent,
    cancelEventsRange,

    getAllIntervals,
    clearIntervals,
    addInterval,
    addVisit,
    getAllVisits,
    getAllPatientVisits,
    getCountNearVisits,
    getTodayVisits,
} from './schedules';
export {
    getActualTreatments,
    getCompletedTreatments,
    getAllTreatments,
    seletVisit,
    selectTreatment,
    clearSelections,

    completeReception,
    closeTreatment,
    uploadChatFile,
} from './treatment'


export {
    login,
    logout,
} from './auth'

export {
    getDocTodayInfo,
    getDocShortInfo,
    setExIntervalInfo,
    switchExInterval,
} from './doctor'

export {
    sendNewInfoDoctor,
    getInfoDoctor,
    getNotifications,
    readNotification,
} from './doctorData'