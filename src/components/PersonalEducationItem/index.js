import React from 'react';
import PropTypes from 'prop-types'
import cn from 'classnames'

import { Form } from 'antd'
import Button from '../Button'
import Upload from '../Upload'
import Select from '../Select'
import DatePicker from '../DatePicker'
import Input from '../Input'

import './style.css'
import '../../icon/style.css'
import InputNew from "../InputNew";
import SelectNew from "../SelectNew";
import specs from "../../helpers/specsArray";
import DropZoneUpload from "../DropZoneUpload";
import RangeDPNew from "../RangeDPNew";
import moment from "moment";
import addInfoObj from "../../helpers/addInfoObj";

const FormItem = Form.Item;
const Option = Select.Option;

class PersonalEducationItemForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            educatBlock : 0,
            idCurrentDegree : null,
            mainEducationArr: props.profileDoctor.educationsgroup1 || [],
            secondEducationArr: props.profileDoctor.educationsgroup2 || [],
            degree: {name: props.profileDoctor.academicdegree || "", doc: []},
            status: {name: props.profileDoctor.academicstatus || "", doc: []}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (!err && this.state.educatBlock === 0) {
                this.props.form.resetFields();
                this.setState({educatBlock: 0});
                let toSubmitObj = {
                    educationsgroup1: this.state.mainEducationArr,
                    educationsgroup2: this.state.secondEducationArr,
                    academicdegree: this.state.degree.name,
                    academicdegreedoc: this.state.degree.doc,
                    academicstatus: this.state.status.name,
                    academicstatusdoc: this.state.status.doc,
                    works: this.props.profileDoctor.works // fix server bug
                };
                this.props.onSubmit(toSubmitObj);
            }
        });
    };

    validateYears = (rule, value, cb) => {

        if( (this.state.isName || this.state.isCycle || this.state.isDate || this.state.isFile) && !this.state.isDate) {
            cb("Введите период обучения")
        }
        if((value && value[0] && value[1]) || (value && !value[0] && !value[1]) || !value) {
            cb()
        } else cb("Введите период обучения")
    };

    addDp = () => {
        this.setState({educatBlock: 1})
    };

    renderDp = (getFieldDecorator) => {
        let dpArr = [];

        if(this.state.educatBlock === 1)
            dpArr.push(
                <div className="personal-item" key={1}>
                        <FormItem>
                            {getFieldDecorator('educationsgroup1-education', {
                                rules: [{
                                    required: true,
                                    message: 'Введите учебное заведение'
                                }],
                            })(
                                <InputNew width ="100%" bubbleplaceholder="* Учебное заведение"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('educationsgroup1-speciality', {
                                rules: [{
                                    required: true,
                                    message: 'Введите квалификацию'
                                }],
                            })(
                                <SelectNew width ="100%"
                                           bubbleplaceholder="* Квалификация"
                                           mode="multiple"
                                           data={specs}
                                />
                            )}
                        </FormItem>
                            <FormItem>
                                {getFieldDecorator('educationsgroup1-finishucationyear', {
                                    rules: [{
                                        required: true,
                                        message: 'Введите год окончания',

                                    },{
                                        pattern: /^[ ]*[0-9]{4}[ ]*$/,
                                        message: "Неправильной формат года"
                                    }],
                                })(
                                    <InputNew width ="100%" bubbleplaceholder="* Год окончания"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('educationsgroup1-diplomphoto', {
                                    rules: [{
                                        required: true,
                                        message: 'Загрузите подтверждающий документ'
                                    }],
                                })(
                                    <DropZoneUpload
                                        uploadFile = {this.props.uploadFile}
                                        text="Прикрепить диплом, свидетельство"
                                    />
                                )}
                            </FormItem>
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    let newEducationEntry = {
                                        education: values['educationsgroup1-education'],
                                        speciality: values['educationsgroup1-speciality'],
                                        finishucationyear: values['educationsgroup1-finishucationyear'],
                                        diplomphoto: values['educationsgroup1-diplomphoto']
                                    };
                                    this.setState({
                                        educatBlock: 0,
                                        mainEducationArr: [...this.state.mainEducationArr, newEducationEntry]
                                    });
                                }
                            });
                        }}
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                </div>
            );
        return (<div className="new-d">{dpArr}</div>);
    };

    addDp2 = () => {
        this.setState({educatBlock:2})
    };

    renderDp2 = (getFieldDecorator) => {
        let dpArr2 = [];

        if (this.state.educatBlock === 2) {
            dpArr2.push(
                <div className="personal-item" key={2}>
                    <div className="step-block">
                        <FormItem>
                            {getFieldDecorator('educationsgroup2-education', {
                                rules: [{
                                    required: true,
                                    message: 'Введите учебное заведение'
                                }],
                            })(
                                <InputNew width="100%" bubbleplaceholder="Учебное заведение"
                                          className="step-form-item"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('educationsgroup2-ciklname', {
                                rules: [{
                                    required: true,
                                    message: 'Введите название цикла обучения'
                                }],
                            })(
                                <InputNew width="100%" bubbleplaceholder="Название цикла обучения"
                                          className="step-form-item"/>
                            )}
                        </FormItem>
                        <div className="step-row">
                            <FormItem>
                                {getFieldDecorator('educationsgroup2-ucationyears', {
                                    valuePropName: 'rangeSet',
                                    rules: [{
                                        validator: this.validateYears
                                    }],
                                })(
                                    <RangeDPNew/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('educationsgroup2-diplomphoto', {
                                    rules: [{
                                        required: true,
                                        message: 'Загрузите подтверждающий документ'
                                    }],
                                })(
                                    <DropZoneUpload
                                        uploadFile={this.props.uploadFile}
                                        text="Прикрепить диплом, свидетельство"
                                    />
                                )}
                            </FormItem>
                        </div>
                    </div>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    let newEducationEntry = {
                                        education: values['educationsgroup2-education'],
                                        ciklname: values['educationsgroup2-ciklname'],
                                        ucationyears: [
                                            Math.ceil(moment(values['educationsgroup2-ucationyears'][0]).format('x') / 1000).toString(),
                                            Math.ceil(moment(values['educationsgroup2-ucationyears'][1]).format('x') / 1000).toString()
                                        ],
                                        diplomphoto: values['educationsgroup2-diplomphoto']
                                    };
                                    this.setState({
                                        educatBlock: 0,
                                        secondEducationArr: [...this.state.secondEducationArr, newEducationEntry]
                                    });
                                }
                            });
                        }}
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr2}
            </div>
        );
    };

    addDp3 = (id) => {
        this.setState({educatBlock:3, idCurrentDegree: id})
    };

    renderDp3 = (getFieldDecorator) =>{
        let dpArr3 = [];
        if(this.state.educatBlock === 3) {
            dpArr3.push(
                <div className="personal-item" key={3}>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('changeDegreeField', {
                            rules: [{
                                required: true,
                                message: 'Введите ученую степень'
                            }],
                        })(
                            <Select placeholder="Ученая степень">
                                {addInfoObj.degree.map((item) => <Option value={item}>{item}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('uploadDegree', {
                        })(
                            <DropZoneUpload
                                uploadFile={this.props.uploadFile}
                                text="Прикрепить документ, подтверждающий ученую степень"
                            />
                        )}
                    </FormItem>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    this.setState({
                                        educatBlock: 0,
                                        degree: {name: values['changeDegreeField'], doc: values['uploadDegree']}
                                    });
                                }
                            });
                        }}
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr3}
            </div>
            );
    };

    addDp4 = (id) => {
        this.setState({educatBlock:4, idCurrentDegree: id})
    };

    renderDp4 = (getFieldDecorator) =>{
        let dpArr4 = [];
        if(this.state.educatBlock === 4) {
            dpArr4.push(
                <div className="personal-item" key={4}>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('changeStatusField', {
                            rules: [{
                                required: true,
                                message: 'Введите ученое звание'
                            }],
                        })(
                            <Select placeholder="Ученое звание">
                                {addInfoObj.title.map((item) => <Option value={item}>{item}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem className="personal-item" >
                        {getFieldDecorator('uploadStatus', {
                        })(
                            <DropZoneUpload
                                uploadFile={this.props.uploadFile}
                                text="Прикрепить документ, подтверждающий ученое звание"
                            />
                        )}
                    </FormItem>
                    <div className="personal-item">
                        <Button onClick={() => {
                            this.props.form.validateFields((err, values) => {
                                if (!err) {
                                    this.setState({
                                        educatBlock: 0,
                                        status: {name: values['changeStatusField'], doc: values['uploadStatus']}
                                    });
                                }
                            });
                        }}
                                className="personal-btn"
                                btnText='Готово'
                                size='small'
                                type='no-brd'
                                icon=''
                                iconSize={11}
                                svg
                        />
                    </div>
                </div>
            )
        }
        return (
            <div className="new-d">
                {dpArr4}
            </div>
        );
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.profileDoctor && JSON.stringify(nextProps.profileDoctor) !== JSON.stringify(this.props.profileDoctor)) {
            this.setState({
                mainEducationArr: nextProps.profileDoctor.educationsgroup1,
                secondEducationArr: nextProps.profileDoctor.educationsgroup2,
                degree: {name: nextProps.profileDoctor.academicdegree, doc: []},
                status: {name: nextProps.profileDoctor.academicstatus, doc: []}
            });
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {mainEducationArr, secondEducationArr, degree, status} = this.state;
        const rootClass = cn('personal-education');

        const institution = mainEducationArr.map((elem, i) => {
            mainEducationArr[i].id = "mainEducation" + i;
            return (
                <div key={"mainEducation" + i} className="personal-item mb-35 brd-b brd-d">
                    <div className="personal-info">
                        <p>
                            {elem.education}, {elem.finishucationyear}
                        </p>
                    </div>
                    <div className="personal-info">
                        <p>
                            {elem.speciality.join(', ')}
                        </p>
                    </div>

                </div> );
        });
        const institutionSecond = secondEducationArr.map((elem, i) => {
            secondEducationArr[i].id = "mainEducation" + i;
            return (
                <div key={"secondEducation" + i} className="personal-item pb-25 mb-35 brd-b brd-d">
                    <div className="personal-info">
                        <p>
                            {elem.education}, {moment(elem.ucationyears[0] * 1000).format('MMMM YYYY')} - {moment(elem.ucationyears[1] * 1000).format('MMMM YYYY')}
                        </p>
                    </div>
                    <div className="personal-info">
                        <p>
                            {elem.ciklname}
                        </p>
                    </div>
                    <Button onClick={(e) => {
                        e.preventDefault();
                        let newSecondEducationArr = this.state.secondEducationArr;
                        newSecondEducationArr.splice(i, 1);
                        this.setState({secondEducationArr: newSecondEducationArr});
                    }
                    }
                            className="personal-edit"
                            size='small'
                            type='blue-float'
                            icon='close'
                            iconSize={17}
                            svg
                    />
                </div> );
        });

        const institutionDegree = (
                <div className="personal-item mb-35">
                    <div className="personal-info">{degree.name}</div>
                    {this.state.educatBlock !== 3 && <Button onClick={this.addDp3}
                            className="personal-edit"
                            size='small'
                            type='blue-float'
                            icon='setting_edit'
                            iconSize={17}
                            svg
                    />}
                </div>
        );

        const institutionStatus = (
            <div className="personal-item mb-35">
                <div className="personal-info">{status.name}</div>
                {this.state.educatBlock !== 4 && <Button onClick={this.addDp4}
                        className="personal-edit"
                        size='small'
                        type='blue-float'
                        icon='setting_edit'
                        iconSize={17}
                        svg
                />}
            </div>
        );

        return (
                <Form className={rootClass} onSubmit={this.handleSubmit}>
                    <div className="personal-block">
                        <div className="personal-item">
                            <div className="personal-title">Основное образование</div>
                        </div>

                        {institution}

                        {this.state.educatBlock !== 1 && <div className="personal-item">
                             <Button onClick={this.addDp}
                                className="personal-btn"
                                btnText='Добавить'
                                size='small'
                                type='no-brd'
                                icon='plus'
                                iconSize={11}
                                svg
                            />
                        </div>}
                        {this.renderDp(getFieldDecorator)}
                    </div>

                    <div className="personal-block">
                        <div className="personal-item">
                            <div className="personal-title">Последипломное образование</div>
                        </div>
                        {institutionSecond}

                        {this.state.educatBlock !== 2 && <div className="personal-item">
                             <Button onClick={this.addDp2}
                             className="personal-btn"
                                btnText='Добавить'
                                size='small'
                                type='no-brd'
                                icon='plus'
                                iconSize={11}
                                svg
                            />
                        </div>}
                        {this.renderDp2(getFieldDecorator)}
                    </div>

                    <div className="personal-block">
                        <div className="personal-item">
                            <div className="personal-title">Ученая степень</div>
                        </div>
                        {institutionDegree}
                        {this.renderDp3(getFieldDecorator)}
                    </div>

                    <div className="personal-block">
                        <div className="personal-item">
                            <div className="personal-title">Ученое звание</div>
                        </div>
                        {institutionStatus}
                        {this.renderDp4(getFieldDecorator)}
                    </div>

                    <div className="personal-block">
                        <Button
                            htmlType="submit"
                            btnText='Сохранить изменения'
                            size='default'
                            type='float'
                        />
                    </div>
                </Form>
        )
    }
}

const PersonalEducationItem  = Form.create()(PersonalEducationItemForm);

PersonalEducationItem.propTypes = {
    profileDoctor: PropTypes.object
};

PersonalEducationItem.defaultProps = {
    profileDoctor: {}
};

export default PersonalEducationItem
