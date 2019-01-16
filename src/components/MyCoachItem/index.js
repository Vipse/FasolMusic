import React from 'react';
import PropTypes from 'prop-types'

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

        const allDisciplines = Array.isArray(disciplines) ? disciplines.map( (elem) => elem.discipline.map((el) => el.name) ).join(', ') : []

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
                    <div className='myStudent-info-openChat'>
                        <Button
                            btnText="Открыть чат"
                            type="border-green"
                            onClick={() => goToChat(id)}
                        />
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