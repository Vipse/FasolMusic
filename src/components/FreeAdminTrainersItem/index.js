import React from 'react';

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";


class FreeAdminTrainersItem extends React.Component{

    getStudent = () => {
        const {
            discipline,
            idMaster,
            data,
            isBusy
        } = this.props;

        if (isBusy) {
            if (data){
                
                let training = null;
                data.forEach((item) => {
                    if (idMaster == item.idMaster) training = item;
                })

                if (training){
                    return (
                        <div className="myStudent-info-student">
                            <ProfileAvatar
                                img={training? training.avatar:null}
                                size='small'
                            />
                            <div className="myStudent-info-student-info">
                                <a className="myStudent-info-student-info-name" onClick={() => this.props.onGotoStudent(training.idStudent)}>
                                    {training.name}
                                </a>
                                <div className="myStudent-info-student-info-status">
                                    {training.isTrial ? "Пробная":training.isBooking ? "Бронь":"Тренировка" }
                                </div>
                                
                            </div>
                        </div>)
                }
            }
            
        }

        else return (<div></div>)


    }
    render(){
        const {
            avatar,
            name,
            discipline,
            setChoosenTrainer,
            idMaster,
            id,
            comment,
            trainerList,

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
    setChoosenTrainer: () => {},
    onGoto: () => {},
    onGotoStudent: () => {}
};

export default FreeAdminTrainersItem