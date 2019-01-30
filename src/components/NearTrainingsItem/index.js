import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'

import './style.css'
import '../../icon/style.css'
import Button from "../Button";

class NearTrainingsItem extends React.Component{
    render(){
        const {
            start,
            end,
            discipline,
            name,
            goToChat,
            idTraining,
            idProfile,
            onGoto
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
                <div className='nearTraining-chatBtn'>
                    <Button
                        btnText="Открыть чат"
                        type="border-green"
                        size='small'
                        onClick={() => goToChat(idProfile, idTraining)}
                    />
                </div>
            </div>
        )
    }
}

NearTrainingsItem.propTypes = {

    comment: PropTypes.string,
    end: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fio: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id_doc: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id_user: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    start: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
    img: PropTypes.string,

    onBegin: PropTypes.func,
    onCancel: PropTypes.func,
    onGoto: PropTypes.func,
};

NearTrainingsItem.defaultProps = {
    comment: '',
    end: 0,
    fio: '',
    id: 0,
    id_doc: 0,
    id_user: 0,
    start: 0,
    img: '',
    
    onBegin: () => {},
    onCancel: () => {},
    onGoto: () => {},
};

export default NearTrainingsItem