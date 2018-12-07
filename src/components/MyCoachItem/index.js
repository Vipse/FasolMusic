import React from 'react';
import PropTypes from 'prop-types'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";

class MyCoachItem extends React.Component{
    render(){
        const {
            avatar,
            name,
            discipline,
            setChoosenTrainer,
            idMaster,
            comment,
            trainerList,
        } = this.props;
        return (
            <div className='myStudent' onClick={() => setChoosenTrainer(idMaster, trainerList)}>
                <ProfileAvatar
                    img={avatar}
                    size='small'
                />
                <div className='myStudent-info'>
                    <div>
                        <span className='myStudent-info-name'>{name}</span>
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

MyCoachItem.propTypes = {

};

MyCoachItem.defaultProps = {

};

export default MyCoachItem