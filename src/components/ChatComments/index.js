import React from 'react';
import PropTypes from 'prop-types'

import DownloadLink from '../DownloadLink'


import './style.css'
import '../../icon/style.css'

const ChatComments = props => {
        const {comments, files} = props;

        return (
            <React.Fragment>
                {
                    comments !== "" && files.length !== 0 &&
                    (
                            <div className='message__comments-area'>
                                <div className='message__comments-comments'>
                                    {comments}
                                </div>
                                <div className='message__comments-attachment'>
                                    {
                                        files.map((el,i) => {
                                            return (<DownloadLink
                                                {...el}
                                                size="default" 
                                                type="link"
                                                download
                                                svg
                                                icon="file"
                                                iconSize={11}
                                                key={i}
                                            />)
                                        })
                                    }
                                </div>
                            </div>
                    )
                }
            </React.Fragment>
        )
}

ChatComments.propTypes = {
    comments: PropTypes.string,
    files: PropTypes.array,
};

ChatComments.defaultProps = {
    comments: '',
    files: [],
};

export default ChatComments