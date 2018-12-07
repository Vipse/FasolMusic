import React from 'react';
import PropTypes from 'prop-types'
import { Steps as AntSteps } from 'antd';

import './styles.css'
const Step = AntSteps.Step;


class Steps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        steps: this.props.steps,
    };
  }

  render() {
    const { steps } = this.state;
    const  {current} = this.props;

    return (
      <div className='steps'>
        <AntSteps current={current} size="small">
          {steps.map(item => <Step key={item.title}
                                   title={item.title} />)}
        </AntSteps>
        <div className="steps-content">
            {steps[current].content(this.props.curState)}</div>
      </div>
    );
  }
}

Steps.propTypes ={
    steps: PropTypes.array,
}

Steps.defaultProps = {
    steps: [],
}

export default Steps