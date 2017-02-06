import React, { Children, Component, cloneElement, PropTypes } from 'react';

class TouchControls extends Component {
  static props = {
    children: PropTypes.element.isRequired,
    tapTolerance: PropTypes.number,
    swipeTolerance: PropTypes.number,
    onSwipe: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onTap: PropTypes.func
  }

  static defaultProps = {
    tapTolerance: 10,
    moveTolerance: 60
  }

  static initialState = {
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      touchMoved: false
  }

  constructor() {
    super();

    this.state = this.initialState;

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  handleTouchStart(event) {
    const startX = event.touches[0].clientX;
    const startY = event.touches[0].clientY;

    this.setState({
      startX: startX,
      startY: startY,
      lastX: startX,
      lastY: startY
    });
  }

  handleTouchEnd(event) {
    console.log(this.state.touchMoved);
    if (this.state.touchMoved && this.props.onSwipe) {
      const direction = this.getSwipeDirection();

      if (direction) {
        this.props.onSwipe(event, direction);
      }
    }
    else if (this.state.touchMoved && this.props.onDragEnd) {
      console.log('Drag end');
      this.props.onDragEnd(event);
    }
    else if (this.props.onTap) {
      this.props.onTap(event);
    }

    this.setState({touchMoved: false});
  }

  getSwipeDirection() {
    const distanceX = Math.abs(this.state.startX - this.state.lastX);
    const distanceY = Math.abs(this.state.startY - this.state.lastY);

    if (distanceX <= this.props.swipeTolerance) {
      return this.state.startY > this.state.lastY ? 'top' : 'bottom';
    }
    else if (distanceY <= this.props.swipeTolerance) {
      return this.state.startX > this.state.lastX ? 'left' : 'right';
    }
  }

  handleTouchCancel(event) {
    this.setState(this.initialState);
  }

  handleTouchMove(event) {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;

    const moveX = currentX - this.state.lastX;
    const moveY = currentY - this.state.lastY;

    let touchMoved = this.state.touchMoved;

    if (!touchMoved && (Math.abs(moveX) <= this.props.tapTolerance || Math.abs(moveY) <= this.props.tapTolerance)) {
      touchMoved = true;
    }

    if (this.props.onDrag) {
      this.props.onDrag(event, moveX, moveY);
    }

    this.setState({
      lastX: currentX,
      lastY: currentY,
      touchMoved: touchMoved
    });
  }

  render() {
    const element = Children.only(this.props.children);

    return cloneElement(element, {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchCancel: this.handleTouchCancel,
      onTouchEnd: this.handleTouchEnd,
    });
  }
}

export default TouchControls;