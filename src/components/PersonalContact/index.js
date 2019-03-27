import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import Button from '../Button'
import Accordion from '../Accordion'
import PersonalContactItem from '../PersonalContactItem'
import Input from '../Input'
import Rate from '../Rate'
import Icon from '../Icon'
import Popover from '../Popover'
import {profileCoach} from '../PersonalContactItem/mock-data'

import './style.css'
import '../../icon/style.css'

class PersonalContact extends React.Component{

    render(){
        const rootClass = cn('personal-contact-all');
        const Panel = Accordion.Panel;
        return (
            <div className={rootClass}>
                <Accordion defaultActiveKey={['1']}>
                    <Panel header="Контакты" key="1">
                        <PersonalContactItem
                            profileCoach={this.props.profileCoach}
                            onSubmit={this.props.onSubmit}
                            onSubmitPassword={this.props.onSubmitPassword}
                            onDeleteAvatar={this.props.onDeleteAvatar}
                        />
                    </Panel>
                </Accordion>
            </div>
        )
    }

}

PersonalContact.propTypes = {
    profileCoach: PropTypes.object,
    onSubmit: PropTypes.func
};

PersonalContact.defaultProps = {
    profileCoach: {},
    onSubmit: () => {}
};

export default PersonalContact
