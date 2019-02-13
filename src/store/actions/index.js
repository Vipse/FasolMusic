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
    searchUsers,
    getNotifications,
    readNotification
} from './loading'

export {
    setReceptionStatus,
    setBeginTime,
    setIsCompleteStatus,
    setIsTrialStatus,
    setChatFromId,
    setChatToId,
    setChatTrainingId,
    setIsCallingStatus,
    setChatStory,
    setConversationMode,
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
    isPushBtnUnfresh,
} from './abonement'

export {
    getDeadlinePay,
    getInfoMasters,
    getInfoStudents,
    getUserInfo,

    createTraining,
    getAvailableInterval,
    getMasterSchedule,
    masterFreeOnDate,
    getTheMasterInterval,
    getTrainingTrialStatusByDiscipline,
    getTrainingsTrialStatus,
    transferTrainPopupDisable,
    setPushBtnTransferTraining,
    setPushBtnAddTraining,
    setPushTrialTraining,
    noSetBtnTraining,
    getDisciplineCommunication,
    saveDisciplineCommunication,
    setMasterTheDisicipline,
    addAmountTraining,
    saveStudentMasterDisciplineCommunication,
    getUseFrozenTraining,
    editUseFrozenTraining,
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
    getTrainingChatHistory,
    completeReception,
    getFutureTrialTraining,
} from './training'


export {
    getFreeAndBusyMasterList,
    getAllInfoMasters
} from './admin'


export {
    getToken,
    checkToken,
} from './acquiring'