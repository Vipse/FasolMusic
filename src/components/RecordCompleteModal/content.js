import React from 'react';
import moment from 'moment'
import {Form, message} from 'antd';
import TextArea from '../TextArea'
import Upload from '../Upload'
import Icon from '../Icon'
import TimePicker from '../TimePicker'
import {previewFile} from "../../helpers/modifyFiles";
import Checkbox from '../Checkbox'
import Button from '../Button'
import Hr from "../Hr";
import Spinner from "../Spinner";
import Radio from "../RadioBox";
import RadioGroup from "antd/es/radio/group";
import RangeTp from "../TimePicker/RangeTP";
import Slider from "antd/es/slider";

class ContentForm extends React.Component {
    state = {};

    render() {
        const {getFieldDecorator} = this.props.form;
        const {type, date, time} = this.props;

        if (type === "trial")
        return (
                <div className="RecordCompleteModal"><p className="info">Ваша пробная тренировка {date} в {time}.</p>
                    <Button className="saveBtn"
                            btnText='ОК'
                            onClick={() => {
                            }}
                            size='default'
                            type='light-pink'
                    />
                </div>
        );

        else return (<div className="RecordCompleteModal"><p className="info">Запись успешна.</p>
            <Button className="saveBtn"
                    btnText='ОК'
                    onClick={() => {
                    }}
                    size='default'
                    type='light-pink'
            />
        </div>);
    }
}

const Content = Form.create()(ContentForm);

export default Content
