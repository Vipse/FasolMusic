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
            fio,
            discipline,
            setChoosenTrainer,
            idMaster,
            comment,
        } = this.props;
        return (
            <div className='myStudent' onClick={() => setChoosenTrainer(this.props.idMaster)}>
                <ProfileAvatar
                    img={avatar}
                    size='small'
                />
                <div className='myStudent-info'>
                    <div>
                        <span className='myStudent-info-name'>{fio}</span>
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