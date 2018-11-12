import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button'
import ProfileAvatar from '../ProfileAvatar'


import './style.css'
import '../../icon/style.css'

class AddNewPatientItem extends React.Component{

    onAddHandler = (e, flag) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        flag==="add" ? this.props.onAdd(this.props.id) :  this.props.onDelete(this.props.id, this.props.name);
    }
    highlight = (text, higlight) => {
        let parts = text.split(new RegExp(`(${higlight})`, 'gi'));
        return <span>{parts.map(part => part.toLowerCase() === higlight.toLowerCase() ? <b>{part}</b> : part)}</span>;
    }
    render(){
        const { name, age, avatar, online, isSearchItem, usertype, academicdegree,
            academicstatus, category, specialitys, favorite, searchQuery} = this.props;

        return (
            <div className='new-patient-item' onClick={() => this.props.onGoto(this.props.id)}>
                <div className='new-patient-avatar'>
                    <ProfileAvatar owner="patient" online={online} img={avatar} size='small'/>
                </div>
                <div className='new-patient-info'>
                    <div className='new-patient-name'>{name}</div>
                    <div className='new-patient-age'>{
                        usertype === "doc" ? (
                            (specialitys ? specialitys.join(". ")+ ". " : "") +
                            (academicdegree ? academicdegree+ ". " : "") +
                            (academicstatus ? academicstatus+ ". " : "") +
                            (category ? category + ". " : "")
                        ) :  "Дисциплина"} </div>

                </div>
                {
                    !isSearchItem && <div className='new-patient-btn'>
                        
                    </div>
                }

            </div>
        )
    }
}

AddNewPatientItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    age: PropTypes.number,
    avatar: PropTypes.string,
    online: PropTypes.bool,
    isSearchItem: PropTypes.bool,
    onAdd: PropTypes.func,
    usertype: PropTypes.string
};

AddNewPatientItem.defaultProps = {
    id: 0,
    name: '',
    age: '',
    online: false,
    avatar: '',
    isSearchItem: false,
    onAdd: () => {},
};

export default AddNewPatientItem
