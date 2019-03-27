import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Accordion from '../Accordion'
import PersonalInformationItem from '../PersonalInformationItem'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'
import {profileCoach} from "../PersonalContactItem/mock-data";

import './style.css'
import '../../icon/style.css'

class PersonalInformation extends React.Component{

    render(){
        const rootClass = cn('personal-information-all');
        const Panel = Accordion.Panel;

        return (
            <div className={rootClass}>
                <Accordion defaultActiveKey={['1']}>
                    <Panel header="Дополнительная информация" key="1">
                        <PersonalInformationItem
                            profileCoach={this.props.profileCoach}
                            onSubmit={this.props.onSubmit}
                        />
                    </Panel>
                </Accordion>
            </div>
        )
    }
}

PersonalInformation.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalInformation.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default PersonalInformation
