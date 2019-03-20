export {
    setFreeIntervals,
    setNeedSaveIntervals,
    selectPatient
} from './patients';

export {
    login,
    logout,
    registerUser,
    resetRegisterStatus,
    reportBug,
    registerTrainer,
    getIdUserByToken,
    resetError,
    setOnlineStatus,
    connectionToSocialNetwork,
    socialNetworkCheck,
    socialAuthorization
} from './auth'

export {
    getInfoPatient,
    saveUserEdit,
    changePassword
} from './patientData'

export {
    getInfoDoctor,
    getTrainerTrainings,
    uploadFile
} from './doctorData'

export {
    loadingStart,
    loadingEnd,
    getSelectors,
    getMultipleSelectors,
    searchUsers,
    getNotifications,
    readNotification,
    getPromoList,
    getUserCountry,
    getAbonementsPrice
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
    checkInterlocutorOnlineStatus,
    setWebSocketStatus
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
    changePushBtnUnfresh,
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
    setMasterTheDisicipline,
    addAmountTraining,
    getUseFrozenTraining,
    editUseFrozenTraining,
    unsetPushBtnTransferTraining,
    rateMaster,
    changeBtnBack,
    changeBtnTransfer
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
