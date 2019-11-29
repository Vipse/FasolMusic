export {
    setFreeIntervals,
    setNeedSaveIntervals,
    selectStudent
} from './students';

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
} from './studentData'

export {
    getInfoDoctor,
    getTrainerTrainings,
    uploadFile
} from './coachData'

export {
    startLoading,
    endLoading,

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
    getUserFono
} from './abonement'

export {
    getDeadlinePay,
    getInfoMasters,
    getInfoStudents,
    getUserInfo,

    createTraining,

    getMasterSchedule,
 



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
    changeBtnTransfer,

  
    setParamsStatusPush
} from './student'

export {
    getMasterList,
  
    setChooseMasterAllInfo,
    getPostTrainerTraining,
    getFutureTrainerTraining,
    getTodayTrainerTraining,
} from './trainer'


export {
    handleChangeTime,
    
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
    //getAllInfoMasters,
    getReport,
    getRegistrationRepost,
    getInfoScheduleStudent,

    getFreeAndBusyMasterListOnHour,
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


export {
    showListTrainersModal,
    hideListTrainersModal,

    showTransferOrFreezeModal,
    hideTransferOrFreezeModal,

    showCreateTrainModal_clickUnfreeze,
    hideCreateTrainModal_clickUnfreeze,
    showCreateTrainModal_clickTrial,
    hideCreateTrainModal_clickTrial,

    showTransferOrNewScheduleModal,
    hideTransferOrNewScheduleModal,

    showRemoveTrialTrainingModal,
    hideRemoveTrialTrainingModal,

    showConfirmCreateModal,
    hideConfirmCreateModal
} from './modal'


export {
    getStudentsSchedule,
    getTrainerTraining,

    setParamsId,
    getAvailableInterval,
    getTheMasterInterval,
    masterFreeOnDate,
    clearFreeInterval,
} from './scheduleIdParams'
