import React from 'react';

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";

class MyStudentsItem extends React.Component{
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

        const allDisciplines = Array.isArray(disciplines) ?
            disciplines.map((elem) => elem.discipline ? elem.discipline[0].name : null).join(', ') : [];

        return (
            <div className='my-student'>
                <div className='my-student-avatar' onClick={() => onGoto(id)}>
                    <ProfileAvatar
                        img={profileAvatar}
                        size='small'
                    />
                </div>
                <div className='my-student-info'>
                    <div>
                        <span className='my-student-info-name' onClick={() => onGoto(id, 'student')}>{name ? name : <span>&mdash;</span>}</span>
                        <span className='my-student-info-discipline'>{allDisciplines}</span>
                    </div>
                    <div className='my-student-info-lastMessage'>
                    {lastMessage}
                    </div>
                    <div className='my-student-info-openChat'>
                        <Button
                            btnText="Открыть чат"
                            type="border-green"
                            size='small'
                            onClick={() => goToChat(id)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

MyStudentsItem.propTypes = {

};

MyStudentsItem.defaultProps = {

};

export default MyStudentsItem