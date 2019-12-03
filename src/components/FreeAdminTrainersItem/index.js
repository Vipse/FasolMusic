import React from 'react';

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import history from '../../store/history';


class FreeAdminTrainersItem extends React.Component {

    getStudent = () => {
        const {
            student,

            infoTraining,
        } = this.props;


        
        if (!student) return null;

        return (
            <div className="myStudent-info-student">
                <ProfileAvatar
                    img={(student.avatar && !student.avatar === '') ? student.avatar : null}
                    size='small'
                />
                <div className="myStudent-info-student-info">
                    <a className="myStudent-info-student-info-name" onClick={() => history.push(`/app/student${student.id}`)}>
                        {student.name}
                    </a>
                    <div className="myStudent-info-student-info-status">
                        {student.isTrial ? "Пробная" : student.isBooking ? "Бронь" : "Тренировка"}
                    </div>
                    <div className="myStudent-info-student-info-amount">
                        {`${infoTraining.number} из ${infoTraining.all}`}
                    </div>

                </div>
            </div>)
    }
    render() {
        const {
            avatar,
            name,
            discipline,
            idMaster,
            id,
            comment,

        } = this.props;


        return (
            <div className='myStudent-wrapper'>
                <div className='myStudent' >
                    <ProfileAvatar
                        img={avatar}
                        size='small'
                    />
                    <div className='myStudent-info'>
                        <div>
                            <a className='myStudent-info-name' onClick={() => this.props.onGoto(id ? id : idMaster)}>{name}</a>
                            <span className='myStudent-info-discipline'>{discipline}</span>
                        </div>
                        <div className='myStudent-info-lastMessage'>
                            {comment}
                        </div>
                        {this.getStudent()}
                    </div>

                </div>
            </div>
        )



    }
}

FreeAdminTrainersItem.propTypes = {

};

FreeAdminTrainersItem.defaultProps = {
    setChoosenTrainer: () => { },
    onGoto: () => { },
    onGotoStudent: () => { }
};

export default FreeAdminTrainersItem