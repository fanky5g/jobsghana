import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Icon, Button, Layout } from 'antd';
import Q from 'q';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const { Header, Content } = Layout;

class Popup extends PureComponent {
  static propTypes = {
	  header: PropTypes.node,
  	content: PropTypes.node,
  	footer: PropTypes.node,
  };

  state = {
    isModalOpen: false,
  };

  static defaultProps = {
    animationSpeed: 300,
    classNames: {
      modalEffect: 'modal-effect',
    },
  };

  componentWillReceiveProps (nextProps) {
    this.setState({isModalOpen: nextProps.active})
  }

  close = () => {
    const { visited, closePopup, componentIndex } = this.props;
    this.setState({
      isModalOpen: false,
    });

    closePopup();
    visited(componentIndex);
  };

  render() {
    const { header, content, footer, goToUrl } = this.props;

    return (
      <ReactCSSTransitionGroup
        transitionName={this.props.classNames.modalEffect}
        transitionEnterTimeout={this.props.animationSpeed}
        transitionLeaveTimeout={this.props.animationSpeed}
       >
        {(() => {
          if (this.state.isModalOpen) {
            return (
              <Modal isOpen={this.state.isModalOpen} className="confirm" contentLabel="Modal" tabIndex='-1'>
                <div className="confirm-wrap">
                  <div className="confirm-inner" ref="inner">
                  <div className="modal-dialog">
                  <div className="modal-close">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.close}>
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
        					<div className="modal-content">
                    {
                      header &&
                      <div className="modal-header">
                        <h4 className="modal-title">{header}</h4>
                      </div>
                    }
        						<div className="modal-body">
                      {
                        (() => {
                        if (React.isValidElement(content)) {
                          return React.cloneElement(content, {
                            goToUrl,
                            dispatch: this.props.dispatch,
                            requiresAction: this.props.requiresAction,
                            processing: this.props.processing,
                            actionComplete: this.props.actionComplete,
                            message: this.props.message,
                            action: this.props.action,
                            close: this.close,
                          });
                        } else {
                          return content;
                        }
                        })()
                      }
        						</div>
                    {
                      footer &&
                      <div className="modal-footer">
                        {
                          (() => {
                          if (React.isValidElement(footer)) {
                            return React.cloneElement(footer, {
                              goToUrl,
                              dispatch: this.props.dispatch,
                              requiresAction: this.props.requiresAction,
                              processing: this.props.processing,
                              actionComplete: this.props.actionComplete,
                              message: this.props.message,
                              action: this.props.action,
                              close: this.close,
                            });
                          } else {
                            return footer;
                          }
                          })()
                        }
                      </div>
                    }
        					</div>
                  </div>
        				</div>
        			</div>
              </Modal>)
          }
        })()}
      </ReactCSSTransitionGroup>
    )
  }
}

export default Popup;

// <div className={classnames({Popup: true, active: active})}>
// 	<div className="popup-title">
// 		{header}
// 	</div>
// 	<div className="popup-body">
// 		{body}
// 	</div>
// </div>