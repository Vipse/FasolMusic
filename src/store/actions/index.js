import { getFreeAndBusyMasterList } from './admin';

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
    sendMessage,
    setFreeIntervals,
    setNeedSaveIntervals,
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
    registerUser,
    resetRegisterStatus,
    setOnlineStatus,
    checkEmailAvailability,
    reportBug,
    registerTrainer
} from './auth'

export {
    getInfoPatient,
    saveUserEdit,
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
    getTrainerTrainings,
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
    getSelectors,
    searchUsers
} from './loading'

export {
    setReceptionStatus,
    setChatFromId,
    setChatToId,
    setChatTrainingId,
    setIsCallingStatus,
    setChatStory,
    setNewTimer,
    setChatInterlocutorInfo
} from './chatWS'

export {
    createAbonement,
    getAbonements2,
    transferTrainining,
    transferTraininingToEnd,
    changeSubscription,
    freezeAbonement,
    changeCurrDiscipline,
    setWeekInterval,
    setChooseTheMasterByStudent,
    getAbonementsFilter,
    getSubscriptionsByStudentId,
    getStudentBalance,
} from './abonement'

export {
    getMyMasters,
    getDeadlinePay,
    getInfoMasters,
    getUserInfo,

    createTraining,
    getAvailableInterval,
    getMasterSchedule,
    masterFreeOnDate,
    getTheMasterInterval,
    getTrainingTrialStatusByDiscipline,
    setPushBtnTransferTraining,
    setPushBtnAddTraining,
    setPushTrialTraining,
    noSetBtnTraining,
    getDisciplineCommunication,
    saveDisciplineCommunication,
    setMasterTheDisicipline,
    addAmountTraining,
    saveStudentMasterDisciplineCommunication,
} from './student'

export {
    getMasterList,
    getTrainerTraining,
    setChooseMasterAllInfo,
    getPostTrainerTraining,
    getFutureTrainerTraining,
    getTodayTrainerTraining,
    
} from './trainer'


export { 
    getTrainingNotFinished,
    getNextTraining,
    getMyMastersOrStudents,
    unauthorizedTrialDataSave,
    getAllTrainingStudent,
    setHomeworkEdit,
    uploadTrainingChatHistory,
    getTrainingChatHistory
} from './training'


export {
    getFreeAndBusyMasterList,
    getAllInfoMasters
} from './admin'