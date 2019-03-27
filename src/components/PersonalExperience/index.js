import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Accordion from '../Accordion'
import PersonalExperienceItem from '../PersonalExperienceItem'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'

import './style.css'
import '../../icon/style.css'
import {profileCoach} from '../PersonalContactItem/mock-data'
import PersonalInformation from "../PersonalInformation";
import PersonalEducation from "../PersonalEducation";

class PersonalExperience extends React.Component{

    render(){
        const rootClass = cn('personal-experience-all');
        const Panel = Accordion.Panel;

        return (

            <div className={rootClass}>
                <Accordion defaultActiveKey={['1']}>
                    <Panel header="Опыт работы" key="1">
                        <PersonalExperienceItem
                            profileCoach={this.props.profileCoach}
                            onSubmit={this.props.onSubmit}
                            uploadFile={this.props.uploadFile}
                        />
                    </Panel>
                </Accordion>
            </div>
        )
    }
}

PersonalExperience.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalExperience.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default PersonalExperience
