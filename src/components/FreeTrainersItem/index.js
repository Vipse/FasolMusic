import React from 'react';
import PropTypes from 'prop-types'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";

class FreeTrainersItem extends React.Component{
    render(){
        const {
            avatar,
            name,
            discipline,
            setChoosenTrainer,
            idMaster,
            comment,
            trainerList,
            onGoto,
        } = this.props;

console.log("WW this.", this.props)
        return (
            <div className='myStudent' onClick={() => setChoosenTrainer(idMaster)}>
                <ProfileAvatar
                    img={avatar}
                    size='small'
                />
                <div className='myStudent-info'>
                    <div>
                        <span className='myStudent-info-name' onClick={() => onGoto(idMaster)}>{name}</span>
                        <span className='myStudent-info-discipline'>{discipline}</span>
                    </div>
                    <div className='myStudent-info-lastMessage'>
                        {comment}
                    </div>
                </div>
            </div>
        )
    }
}

FreeTrainersItem.propTypes = {

};

FreeTrainersItem.defaultProps = {
    setChoosenTrainer: () => {},
    onGoto: () => {}
};

export default FreeTrainersItem