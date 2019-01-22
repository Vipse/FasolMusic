import React from 'react'
import PropTypes from 'prop-types'

import ProfileAvatar from '../ProfileAvatar'

import './styles.css'
import {Redirect} from "react-router-dom";

class ProfileCard extends React.Component{
    shouldComponentUpdate(nextProps) {
        return (
            (this.props.img !== nextProps.img) ||
            (this.props.name !== nextProps.name) ||
            (this.props.isShort !== nextProps.isShort)
        )
    }
    render(){
        const {isShort, name, img, onClick} = this.props;
        const rootClass = isShort ? "profileCard-short" : "profileCard";
        return (
            <div className={rootClass} onClick={onClick}>
                <ProfileAvatar img={img} short={isShort} size={(isShort ? 'medium' : 'large')}/>
                <div className={'profileCard-name'}>{name}</div>
            </div>
        )
    }
}

ProfileCard.propTypes = {};

ProfileCard.defaultProps = {};

export default ProfileCard;
