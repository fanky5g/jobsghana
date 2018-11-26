import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Content, Spinner } from 'react-mdl';
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin from 'draft-js-image-plugin';

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

const imagePlugin = createImagePlugin();

export default class EditorComponent extends PureComponent {
  static propTypes = {
    content: PropTypes.object,
    contentChanged: PropTypes.func,
    rows: PropTypes.number,
    insertedImage: PropTypes.object,
    editMode: PropTypes.bool,
    inited: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      editorState: this.props.content,
    };

    this.setDomEditorRef = (ref) => {
      this.editor = ref;
    };
  }

  onChange = (editorState) => {
    this.setState({editorState});
    this.props.contentChanged(editorState);
  };

  componentDidMount() {
    if (Object.keys(this.props.insertedImage).length > 0) {
      const editorState = this.state.editorState;
      this.onChange(imagePlugin.addImage(editorState, this.props.insertedImage.src, {alt: this.props.insertedImage.alt}));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
      this.setState({
        editorState: nextProps.content,
      });
    }
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const { width, loading } = this.state;

    return (
      <div style={{ display: 'flex', marginTop: '16px' }}>
      {
        loading &&
          <Spinner
            singleColor
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
            }}
          />
      }
        <Content className="Editor">
          {
            // <div style={{marginBottom: "20px"}}>
            //   <EmojiSelect />
            // </div>
          }
          <div onClick={this.focus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              spellCheck={false}
              suppressContentEditableWarning
              className="Editor__TextField"
              handleKeyCommand={this.handleKeyCommand}
              placeholder={this.props.placeholder}
              ref={this.setDomEditorRef}
              plugins={[emojiPlugin, imagePlugin]}
            />
            <EmojiSuggestions />
          </div>
        </Content>
      </div>
    );
  }
}
