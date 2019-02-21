import React from 'react';
import PropTypes from 'prop-types'

import './style.css'
import '../../icon/style.css'
import ProfileAvatar from "../ProfileAvatar";
import Button from "../Button";

class FreeAdminTrainersItem extends React.Component{
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
            onGotoPage,
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
    onGoto: () => {}
};

export default FreeAdminTrainersItem