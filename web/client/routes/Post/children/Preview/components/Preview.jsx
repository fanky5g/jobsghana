import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import showdown from 'showdown';
import { contentStateToMarkdown } from '#app/util/common';

export default class Preview extends PureComponent {
  componentDidMount() {
    const { content } = this.props;
    this.renderPreview(content);
  }

  componentWillReceiveProps(nextProps) {
    const { content } = nextProps;
    this.renderPreview(content);
  }

  renderPreview(content) {
    if (content) {
      let markDown = contentStateToMarkdown(content);

      const renderedContainer = ReactDOM.findDOMNode(this.refs.preview);
      const converter = new showdown.Converter();

      if (markDown == '') {
        markDown = '**You have not typed anything in Editor.**'
      }
      renderedContainer.innerHTML = converter.makeHtml(markDown);
    }
  }

  render() {
    const { content } = this.props;

    return (
      <div className="Preview">
        <div
          className="Editor__Rendered"
          ref="preview"
          >
        </div>
      </div>
    );
  }
}
