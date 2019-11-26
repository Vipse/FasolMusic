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
            id,
            comment
        } = this.props;

        const trainer = {
            id: id ? id : idMaster,
            name
        }

        return (
            <div className='myStudent-wrapper'>
                <div className='myStudent' >
                    <ProfileAvatar
                        img={avatar}
                        size='small'
                    />
                    <div className='myStudent-info'>
                        <div>
                            <a className='myStudent-info-name' onClick={() => this.props.onGotoPage(id ? id : idMaster)}>{name}</a>
                            <span className='myStudent-info-discipline'>{discipline}</span>
                        </div>
                        <div className='myStudent-info-lastMessage'>
                            {comment}
                        </div>
                    </div>
                    
                </div>
                <Button 
                        btnText='Выбрать'
                        size='small'
                        type='border-pink'
                        className="header-btn "
                        onClick={() => setChoosenTrainer(trainer)}
                    />
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