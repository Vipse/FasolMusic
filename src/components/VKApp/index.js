import React from 'react'
import VK, { CommunityMessages } from 'react-vk';

import PropTypes from 'prop-types'


import './styles.css'

class VKApp extends React.Component {

    render() {
        const {apiId, onMount} = this.props;
        return (
            <div id="bugfix">
                <div id="vk_community_messages">
                    <VK apiId={apiId} >
                            <CommunityMessages
                                groupId={apiId}
                                options={{onCanNotWrite: reason => console.log(reason)}}
                                onMount={onMount}
                            />
                    </VK>
                </div>
            </div>
        );
    }
}

VKApp.propTypes = {
    //limit: PropTypes.number,
};

VKApp.defaultProps = {
    //limit: 5,
};

export default VKApp;