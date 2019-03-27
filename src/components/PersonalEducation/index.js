import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Accordion from '../Accordion'
import PersonalEducationItem from '../PersonalEducationItem'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'
import {profileCoach} from '../PersonalContactItem/mock-data'

import './style.css'
import '../../icon/style.css'

class PersonalEducation extends React.Component{

    render(){
       const rootClass = cn('personal-education-all');
        const Panel = Accordion.Panel;
        return (
            <div className={rootClass}>
                <Accordion defaultActiveKey={['1']}>
                    <Panel header="Образование" key="1">
                        <PersonalEducationItem
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

PersonalEducation.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalEducation.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default PersonalEducation
