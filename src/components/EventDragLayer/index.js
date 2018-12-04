import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import  EventSlot  from '../Calendar22/libr/EventSlot';

function collect(monitor) {
  return {
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

function getItemTransform(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

console.log('currentOffset :', currentOffset);
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px) rotate(3deg)`;
  return {  
    position: 'fixed', 
    display: 'block',
    zIndex: 10000,
    transform: transform,
    WebkitTransform: transform,
    cursor: 'move',
  };
}

class EventDragLayer extends Component {
    constructor(props) {
        super(props);
        this.lastUpdate = +new Date();
    }

    render() {
        const { item, isDragging } = this.props;

        if (!isDragging) {
        return null;
        }

        return (
        <div
            id="drag-placeholder"
            style={getItemTransform(this.props)}
        >
            <EventSlot
                event={{id:'123124334',  fio : 'anonimus'}}
                isDragging={isDragging}
            />
        </div>
        );
    }
}

export default DragLayer(collect)(EventDragLayer);