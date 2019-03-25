import React from 'react';
import Card from '../Card'
import './style.css'
import '../../icon/style.css'
import Icon from '../Icon'
import FreeTrainersItem from "../FreeTrainersItem";
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar'
import Button from '../Button';
import Spinner from '../Spinner';

class FreeTrainers extends React.Component {

    studentsRender = (dataArr) => {
        return dataArr.map((item, index) => {
            return (<FreeTrainersItem {...item}
                                    key={index}
                                    onGotoPage={this.props.onGotoPage}
                                    setChoosenTrainer={this.props.setChoosenTrainer}
                                    
            />)
        });
    };


    render() {
        const {freeTrainers} = this.props;

        return (
            <div className='my-free-coach' id="my-coach-wrapper">
               
                    <Card title="Выбери коуча">
                        {!this.props.isSpinnerFreeTrainers ? 
                            <div>
                                <Button 
                                    btnText='Выбрать любого'
                                    size='default'
                                    type='border-pink'
                                    className="header-btn header-btn-transfer my-coach-any"
                                    onClick={this.props.selectAnyTrainer}
                                />         
                                <div>
                                    {Array.isArray(freeTrainers) && freeTrainers.length ?
                                            this.studentsRender(freeTrainers)
                                            : <div className='noStudents'>Коучей нет</div>}
                                </div>
                            </div>
                        :  
                        <div className="freetrainers-spinner">
                            <Spinner isInline={true} size='large'/>
                        </div>}
                        
                    </Card>
                
            </div>
        )
    }
}

FreeTrainers.propTypes = {
    freeTrainers: PropTypes.array,
    setChoosenTrainer: PropTypes.func,
};

FreeTrainers.defaultProps = {
    freeTrainers: [],
    setChoosenTrainer: () => {}
};


export default FreeTrainers