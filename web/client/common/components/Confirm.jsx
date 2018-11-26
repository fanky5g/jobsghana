import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Icon, Button, Layout } from 'antd';
import Q from 'q';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const { Header, Content } = Layout;

export default class Confirm extends PureComponent {
  static propTypes = {
    cancelAction: PropTypes.func,
    title: PropTypes.string,
    abortLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    action: PropTypes.func,
    description: PropTypes.string,
  };

  static defaultProps = {
    confirmLabel: 'OK',
    abortLabel: 'Cancel',
    isModalOpen: false,
    animationSpeed: 300,
    classNames: {
      modalEffect: 'modal-effect',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
    };
    this.$promise = Q.defer();
    // this.updateFocus = this.updateFocus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({isOpen: nextProps.isOpen})
  }

  // componentDidUpdate () {
  //   if (this.state.isOpen) {
  //     const modal = ReactDOM.findDOMNode(this.refs.modal)
  //     modal.focus()
  //   }
  // }

  abort = () => {
    const { cancelAction } = this.props;
    this.setState({
      isModalOpen: false,
    });
    if (typeof cancelAction === 'function') {
      return this.$promise.reject(cancelAction());
    }
    return this.$promise.reject();
  };

  confirm = () => {
    const { action } = this.props;
    this.setState({
      isModalOpen: false,
    });
    if (typeof action === 'function') {
      return this.$promise.resolve(action());
    }
    return this.$promise.resolve();
  };

  // updateFocus (e) {
  //   const modal = ReactDOM.findDOMNode(this.refs.modal)
  //   const modalbtn = ReactDOM.findDOMNode(this.refs.modalbtn)
  //   if (e.keyCode === 9) {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     if (modal === document.activeElement) {
  //       modalbtn.focus()
  //     } else {
  //       modal.focus()
  //     }
  //   }
  // }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName={this.props.classNames.modalEffect}
        transitionEnterTimeout={this.props.animationSpeed}
        transitionLeaveTimeout={this.props.animationSpeed}
       >
        {(() => {
          if (this.state.isModalOpen) {
            return (
              <Modal isOpen={true} className="confirm" contentLabel="Modal" tabIndex='-1'>
                <div className="confirm-wrap">
                  <div className="confirm-inner" ref="inner">
                    <Layout>
                      <Header style={{ height: '40px' }}>
                        <h4 className="confirmTitle">{this.props.title}</h4>
                        <Icon name="cancel" onClick={this.abort} />
                      </Header>
                      <Content>
                      {
                        this.props.description &&
                          <p>{this.props.description}</p>
                      }
                        <div className="Button-container">
                          <Button onClick={this.abort} ref="cancel">{this.props.abortLabel}</Button>
                          <Button onClick={this.confirm} ref="confirm">{this.props.confirmLabel}</Button>
                        </div>
                      </Content>
                    </Layout>
                  </div>
                </div>
              </Modal>)
          }
        })()}
      </ReactCSSTransitionGroup>
    )
  }
}