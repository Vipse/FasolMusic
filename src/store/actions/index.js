import axios from "axios";
import * as actionTypes from "./actionTypes";

export {
    getDocPatients,
    getPatientDoctors,
    getNotDocPatients,
    clearNotDocPatients,
    addPatient,
    addDoctor,
    removePatient,
    removeDoctor,
    getDateInterval,
    getDateIntervalWithoutMakingApp,
    setReception,
    setReceptionByPatient,
    selectPatient,
    unselectPatient,
    makeReview,
    getNotPatientDoctors,
    clearNotPatientDoctors,
    getSelectedPatientInfo,
    searchUsers,
    addOrDeleteUserFromSearch,
    sendMessage,
} from './patients';

export {
    getAllReviews,
    getAllReviewsByPatient,
    putCommentAnswer,

} from './reviews';

export {
    selectEvent,
    deleteEvent,
    cancelEventsRange,

    getAllIntervals,
    clearIntervals,
    clearVisits,
    addInterval,
    addVisit,
    getAllVisits,
    getAllPatientVisits,
    getCountNearVisits,
    getTodayVisits,
    getFreeVisitsBySpec,
} from './schedules';
export {
    getActualTreatments,
    getCompletedTreatments,
    getAllTreatments,
    getPaginationTreatments,
    getAppsBetweenDocAndUser,
    getCompletedApps,
    seletVisit,
    selectTreatment,
    clearSelections,
    completeReception,
    closeTreatment,
    uploadChatFile,
    uploadConclusion,
    addFileToApp,
    getAllFilesTreatment,
    changeReceptionStatus,
    getReceptionDuration,
    clearCallback,
    cancelAppByPatient
} from './treatment'


export {
    login,
    logout,
    registerDoctor,
    registerUser,
    resetRegisterStatus,
    setOnlineStatus,
    checkEmailAvailability,
    reportBug
} from './auth'

export {
    getInfoPatient,
    sendNewInfoPatient,
    sendNewPasswordPatient,
    deleteAvatar,
    sendUserPoleValue,
    getUserInfoShort,
    hasNoReviewToFreeApp
} from './patientData'

export {
    getDocTodayInfo,
    getDocShortInfo,
    setExIntervalInfo,
    switchExInterval,
    getEmergencyAvailability
} from './doctor'

export {
    sendNewInfoDoctor,
    getInfoDoctor,
    getNotifications,
    readNotification,
    getAllDocIntervals,
    getDateWorkIntervalWithoutMakingAppAll,
    uploadFile
} from './doctorData'

export {
    loadingStart,
    loadingEnd,
    docEmergancyCallReceived,
    docEmergancyCallSend,
    docEmergancyCallReceivedMark,
    makeArchiveOfFiles,
} from './loading'

export {
    setReceptionStatus,
    setChatFromId,
    setChatToId,
    setIsCallingStatus,
    setChatStory,
    setNewTimer,

} from './chatWS'
