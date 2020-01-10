import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import { isFasolStudio, isFasolOnline } from '../../hosts'

import './style.css'
import '../../icon/style.css'
import Button from "../Button";

class NearTrainingsItem extends React.Component {

    constructor() {
        super();
        this.state = {
            deleteTrialDisabled: false
        }
    }


    renderBtnsFasolStudio = () => {
        const { user_mode, isTrial, trial, start, idTraining, completeTraining, tailTraining} = this.props;
        const { deleteTrialDisabled } = this.state;

        
        const isAfter = (moment() < moment(+start)) ? true : false
        
        if (user_mode == 'master' && !isAfter) {
            return (<div className='nearTraining-chatBtn'>

                <div className="btn-push">
                    {!deleteTrialDisabled ?
                        <Button
                            btnText="Засчитать"
                            type="border-green"
                            size='small'
                            onClick={() => completeTraining({ idTraining })}
                        /> : ""}
                </div>
                {isTrial && !deleteTrialDisabled ?
                    <div className="btn-push">
                        <Button
                            btnText="Не пришел"
                            type="border-green"
                            size='small'
                            onClick={() => {
                                this.props.removeTrialTraining(idTraining, true)
                                this.setState({ deleteTrialDisabled: true })
                                this.props.refreshTrainingsList();
                            }}
                        />
                    </div> : ''}
                {!isTrial ?
                    <div className="btn-push">
                        {!trial && <Button
                            btnText="Перенести в конец"
                            type="border-green"
                            size='small'
                            onClick={() => tailTraining(idTraining)}
                        />}
                    </div> : ''}
            </div>)
        }
    }

    renderBtnsFasolOnline = () => {
        const {
            start,
            name,
            avatar,
            goToChat,
            idTraining,
            idProfile,
            isComplete,
            trial
        } = this.props;

        return (
            <div className="nearTraining-chatBtn">
                <Button
                    btnText="Открыть чат"
                    type="border-green"
                    size='small'
                    onClick={() => goToChat(idProfile, idTraining, name, avatar, start, isComplete, trial)}
                />
            </div>
        )
    }

    render() {
        const {
            start,
            end,
            discipline,
            name
        } = this.props;

        return (
            <div className='nearTraining'>
                <div className='nearTraining-circleDate'>
                    <span className='nearTraining-circleDate-date'>{moment(start).format("D")}</span>
                    <span className="nearTraining-circleDate-month">{moment(start).format("MMMM")}</span>
                </div>
                <div className="nearTraining-info">
                    <div className="nearTraining-info-time">
                        {`${moment(start).format("H:mm")} — ${moment(end).format("H:mm")}`}
                    </div>
                    <div className="nearTraining-info-name">
                        {name}
                    </div>
                    <div className="nearTraining-info-discipline">
                        {discipline}
                    </div>
                </div>

                {isFasolStudio && this.renderBtnsFasolStudio()}
                {isFasolOnline && this.renderBtnsFasolOnline()}

            </div>
        )
    }
}

NearTrainingsItem.defaultProps = {
    comment: '',
    end: 0,
    fio: '',
    id: 0,
    id_doc: 0,
    id_user: 0,
    start: 0,
    img: '',

    onBegin: () => { },
    onCancel: () => { },
    onGoto: () => { },
};

export default NearTrainingsItem