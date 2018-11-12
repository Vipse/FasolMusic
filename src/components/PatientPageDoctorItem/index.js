import React from 'react';
import PropTypes from 'prop-types'

import Icon from '../Icon'
import RatePanel from '../RatePanel'
import ProfileAvatar from '../ProfileAvatar'

import './style.css'
import '../../icon/style.css'

const PatientPageDoctorItem = props => {
    console.log(props, "PROPS EVERY DOC");
    const handleClick = () => {
        props.onDelete(props.id, props.doctorName);
    }

    const { id, doctorRate, doctorReviews, doctorFavorite, doctorName, doctorCategory, doctorExp,
            doctorPrice, doctorLanguages, doctorChild, doctorAvatar, speciality} = props;
    const onGoTo = () => {
        props.onGoTo(id);
    };
    return (
            <div className='page__doctor-item'>
                <div className='page__doctor-item-block'>
                    <div className='page__doctor-item-rate'>
                        <RatePanel
                            rateValue={doctorRate}
                            timesRated={doctorReviews}
                        />
                    </div>
                    <div className='page__doctor-item-favorites'>
                        {doctorFavorite && (
                            <Icon
                                type='empty'
                                size={20}
                                svg
                                onClick={handleClick}

                            />
                        )}
                    </div>
                </div>
                <div className='page__doctor-item-block'>
                    <div className='page__doctor-item-avatar'>
                        <ProfileAvatar
                          img={doctorAvatar}
                          owner='doctor'
                          size="large"
                          online={true}
                        />
                    </div>
                    <div className='page__doctor-item-info'>
                        <div
                            className='page__doctor-item-name'
                            onClick={onGoTo}>{doctorName}
                        </div>

                        
                        <div className='page__doctor-item-speciality'>{speciality.reduce((acc, current)=> {
                            return `${acc}, ${current}`
                        })+"."}</div>
                        <div className='page__doctor-item-category'>{doctorCategory}</div>
                        <div className='page__doctor-item-exp'>Стаж работы {doctorExp}</div>
                    </div>
                </div>
                <div className='page__doctor-item-block'>
                    <div className='page__doctor-item-price'>
                        <div className='page__doctor-item-price-title'>Стоимость<br />консультации</div>
                        <div className='page__doctor-item-price-coast'>{doctorPrice} руб</div>
                    </div>
                    {doctorLanguages &&
                        <div className='page__doctor-item-language'>
                            <div className='page__doctor-item-language-title'>Знание языков</div>
                            {doctorLanguages.map((item, index)=> <div className='page__doctor-item-language-li' key={index+1}>{item}</div>)}
                        </div>
                    }
                    <div className='page__doctor-item-child'>
                        {doctorChild && (
                            <Icon type='toy_kids' size={50} svg />
                        )}
                    </div>
                </div>
            </div>
        )
}

PatientPageDoctorItem.propTypes = {
    doctorRate: PropTypes.number,
    doctorReviews: PropTypes.number,
    doctorFavorite: PropTypes.bool,
    doctorChild: PropTypes.bool,
    doctorName: PropTypes.string,
    doctorSpeciality: PropTypes.string,
    doctorCategory: PropTypes.string,
    doctorExp: PropTypes.string,
    doctorPrice: PropTypes.string,
    doctorLanguages: PropTypes.array,
};

PatientPageDoctorItem.defaultProps = {
    doctorRate: 0,
    doctorReviews: 0,
    doctorFavorite: false,
    doctorChild: false,
    doctorName: '',
    doctorSpeciality: '',
    doctorCategory: '',
    doctorExp: '',
    doctorPrice: '',
    doctorLanguages: [],
};

export default PatientPageDoctorItem
