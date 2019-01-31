import React from 'react';

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";

class MyCoachItem extends React.Component{
    render(){
        const {
            disciplines,
            name,
            lastMessage,
            onGoto,
            profileAvatar,
            id,
            goToChat
        } = this.props;

        const allDisciplines = Array.isArray(disciplines) ? disciplines.map((elem) => elem.discipline ? elem.discipline[0].name : null).join(', ') : [];

        return (
            <div className='myStudent'>
                <ProfileAvatar
                    img={profileAvatar}
                    size='small'
                />
                <div className='myStudent-info'>
                    <div>
                        <span className='myStudent-info-name' onClick={() => onGoto(id)}>{name}</span>
                        <span className='myStudent-info-discipline'>{allDisciplines}</span>
                    </div>
                    <div className='myStudent-info-lastMessage'>
                    {lastMessage}
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