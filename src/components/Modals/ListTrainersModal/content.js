import React from 'react';
import { Form } from 'antd';
import history from '../../../store/history'

import FreeAdminTrainersItem from '../../FreeAdminTrainersItem'

const FormItem = Form.Item;

class ContentForm extends React.Component {
    constructor(props) {
        super(props);

    }


    renderTrainers = (list) => {
 
        return list.map((item, index) => (
            <FreeAdminTrainersItem 
                        {...item}
                        key={index}
                        onGoto={(id) => history.push('/app/coach' + id)}
            />)
        )
    }

    render() {
        const {freetrainers_listModal, busytrainers_listModal} = this.props;

        return (
            <div className="admin-trainer-wrapper">
                <div className="block-free-trainer">
                    <p className="free-trainer">Свободные тренера</p>
                    {this.renderTrainers(freetrainers_listModal)}

                </div>

                    
                <div className="block-free-trainer">
                    <p className="free-trainer">Занятые тренера</p>
                    {this.renderTrainers(busytrainers_listModal)}
                </div>
            </div>
        )
    }
}

const Content = Form.create()(ContentForm);

export default Content
