import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Icon, Button, Layout } from 'antd';
import Q from 'q';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { EditorState, Editor, RichUtils } from 'draft-js';
import { contentStateToMarkdown } from '#app/util/common';
import Input from './Input';

const { Header, Content } = Layout;

export default class MessageBox extends PureComponent {
  static propTypes = {
    submit: PropTypes.func,
    cancelAction: PropTypes.func,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
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
      subject: '',
      message: EditorState.createEmpty(),
    };

    this.setDomEditorRef = (ref) => {
      this.editor = ref;
    };

    this.$promise = Q.defer();
  }

  contentChanged = (editorState) => this.setState({
    message: editorState,
  });

  onFieldChange = (evt) => this.setState({
    [evt.target.name]: evt.target.value,
  });

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

  submit = () => {
    const { onSubmit } = this.props;

    this.setState({
      isModalOpen: false,
    });

    if (typeof onSubmit === 'function') {
      return this.$promise.resolve(onSubmit(this.state.subject, contentStateToMarkdown(this.state.message)));
    }

    return this.$promise.resolve();
  };

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.message, command);
    if (newState) {
      this.contentChanged(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  focus = () => {
    this.editor.focus();
  };

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
                        <h4 className="confirmTitle">Email to {this.props.name}</h4>
                        <Icon name="cancel" onClick={this.abort} />
                      </Header>
                      <Content>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <label className="control-label sc-label">Subject</label>
                            <Input
                              className="sc-input"
                              placeholder="Resume review observations"
                              onChange={this.onFieldChange}
                              name="subject"
                              type="text"
                              value={this.state.subject}
                              required
                            />
                          </div>
                        </div>
                        <div className="mbox ui-row margin-bottom-20">
                          <div onClick={this.focus} className="col-24">
                            <label className="control-label sc-label">Message</label>
                            {
                              <Editor
                                editorState={this.state.message}
                                onChange={this.contentChanged}
                                spellCheck={false}
                                suppressContentEditableWarning
                                className="Editor__TextField"
                                handleKeyCommand={this.handleKeyCommand}
                                placeholder="Enter message..."
                                ref={this.setDomEditorRef}
                              />
                            }
                            
                          </div>
                        </div>
                        <div className="Button-container">
                          <Button onClick={this.abort}>Cancel</Button>
                          <Button
                            disabled={this.state.subject === '' || !this.state.message.getCurrentContent().hasText()}
                            onClick={this.submit} type="primary">Send</Button>
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