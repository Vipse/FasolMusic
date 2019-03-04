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
    checkEmailAvailability,
    reportBug,
    registerTrainer,
    getInfoLanding,
    getIdUserByToken,
    setOnlineStatus,
    connectionToSocialNetwork,
    socialNetworkCheck,
    socialAuthorization
} from './auth'

export {
    getInfoPatient,
    saveUserEdit,
    sendNewInfoPatient,
    sendNewPasswordPatient,
    deleteAvatar,
    sendUserPoleValue,
    getUserInfoShort,
    hasNoReviewToFreeApp,
    changePassword
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
    readNotification,
    getPromoList
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
    setChatInterlocutorInfo,
    checkInterlocutorOnlineStatus
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
    unsetPushBtnTransferTraining,
    rateMaster
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
    getCountTrainingByDiscipline,
    removeTrialTraining,
    issetTrial,
    saveNotification,
} from './training'


export {
    getFreeAndBusyMasterList,
    getAllInfoMasters,
    getReport
} from './admin'


export {
    getToken,
    checkToken,
} from './acquiring'

export {
    getTrainingHistoryList,
    changeRequestMaxAmount,
    resetTrainingHistoryList
} from './homework'
