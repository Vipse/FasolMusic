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
            <div className='my-coach'>
                <div className='my-coach-avatar' onClick={() => onGoto(id)}>
                    <ProfileAvatar
                        img={profileAvatar}
                        size='small'
                    />
                </div>
                <div className='my-coach-info'>
                    <div>
                        <span className='my-coach-info-name' onClick={() => onGoto(id)}>{name ? name : <span>&mdash;</span>}</span>
                        <span className='my-coach-info-discipline'>{allDisciplines}</span>
                    </div>
                    <div className='my-coach-info-lastMessage'>
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