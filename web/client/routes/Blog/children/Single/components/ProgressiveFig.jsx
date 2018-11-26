import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';
import { parseImageUrl, drawCanvasWithBlur, Iba, In, Jn, getClass, getClassName, getClassMaxWidth, getClassMaxHeight } from '#app/lib/util';
import classnames from 'classnames';


export default class ProgressiveFig extends PureComponent {
  static propTypes = {
    isMounted: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    clientWidth: PropTypes.number.isRequired,
    clientHeight: PropTypes.number.isRequired,
    location: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.c = Iba(this.props.clientWidth, this.props.currLocation);
  }

  componentDidMount() {
    this.refs.noscript.style.display = 'none';
    document.addEventListener('scroll', throttle(this.loadImage, 1000), true);
    this.loadProgressive();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadImage);
  }

  loadImage = () => {
    if (!this.props.isMounted) return;
    const image = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);

    if (this.isVisible() && (image && (!image.complete || image.naturalWidth === 0))) {
      image.src = parseImageUrl({
        key: image.dataset.key,
        width: image.dataset.width,
        height: image.dataset.height,
        q0: !0,
        strategy: 'resample',
      }, this.c);
      image.addEventListener('load', (function onImageLoaded() {
        image.removeEventListener('load', onImageLoaded);
        setTimeout(() => {
          component.classList.add('is-imageLoaded');
        }, 1000);
      }).bind(this));
    }
  };

  loadProgressive() {
    if (!this.props.isMounted) return;
    const CANVAS_BLUR_RADIUS = 8;
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);
    const canvas = ReactDOM.findDOMNode(this.refs['progressiveMedia-canvas']);
    const thumbnail = ReactDOM.findDOMNode(this.refs['progressiveMedia-thumbnail']);
    const image = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    const aspectRatioPlaceholder = ReactDOM.findDOMNode(this.refs.aspectRatioPlaceholder);

    const onThumbnailLoad = () => {
      drawCanvasWithBlur(canvas, thumbnail, CANVAS_BLUR_RADIUS);
      component.classList.add('is-canvasLoaded');
      if (this.isVisible()) this.loadImage();
      aspectRatioPlaceholder.classList.add('is-locked');
    };

    if (thumbnail && (!thumbnail.complete || thumbnail.naturalWidth === 0)) {
      thumbnail.crossOrigin = 'anonymous';
      thumbnail.addEventListener('load', function onImageLoaded() {
        thumbnail.removeEventListener('load', onThumbnailLoad);
        onThumbnailLoad();
      });
    } else {
      onThumbnailLoad();
    }
  }

  setClasses = (classGroup, width, height) => {
    const aspectRatioPlaceholder = ReactDOM.findDOMNode(this.refs.aspectRatioPlaceholder); // maxwidth maxheight
    aspectRatioPlaceholder.classList.add('is-locked');
  };

  getDisplayState = () => {
    const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    if (node) {
      return node && node.currentStyle ? node.currentStyle.display : getComputedStyle(node, null).display;
    }
    return 'none';
  };

  isVisible = () => {
    if (process.env.BROWSER) {
      if (this.getDisplayState() === 'none') {
        return false;
      }
      const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
      const rect = node.getBoundingClientRect();
      return (
        (rect.height > 0 || rect.width > 0) &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    return true;
  };

  scaleImageHeight = () => {
    const { image } = this.props;
    if (image.width > image.height) { //landscape
      return Math.round((75 * image.height) / image.width);
    }
    return 75;
  };

  scaleImageWidth = () => {
    const { image } = this.props;
    if (image.height > image.width) { //landscape
      return Math.round((75 * image.width) / image.height);
    }
    return 75;
  };

  render() {
    const { image } = this.props;

    const classGroup = getClass(image.width, image.height);
    const MaxWidth = getClassMaxWidth(classGroup, image.width, image.height, true);
    const MaxHeight = getClassMaxHeight(classGroup, image.width, image.height, true);
    const className = getClassName(classGroup);

    return (
      <figure className={classnames({"graf--figure": true, [className]: true})} ref="grafFigure">
        <div
          className="aspectRatioPlaceholder"
          ref="aspectRatioPlaceholder"
          style={{maxWidth: MaxWidth, maxHeight: MaxHeight}}
        >
          <div
            className="aspectRatioPlaceholder-fill"
            ref="aspectRatioPlaceholder-fill"
            style={{
              paddingBottom: `${Math.round((image.height / image.width) * 100)}%`,
            }}
          >
          </div>
          <div
            className="progressiveMedia js-progressiveMedia graf-image"
            data-key={image.key}
            data-width={image.width}
            data-height={image.height}
            data-action="zoom"
            data-action-value={image.key}
            data-scroll="native"
            ref="progressiveMedia"
          >
            <img
              data-key={image.key}
              data-width={image.width}
              data-height={image.height}
              src={
                parseImageUrl({
                  key: image.key,
                  width: 30,
                  strategy: 'resample',
                  quality: 20,
                })
              }
              className="progressiveMedia-thumbnail js-progressiveMedia-thumbnail"
              ref="progressiveMedia-thumbnail"
            />
            <canvas
              className="progressiveMedia-canvas js-progressiveMedia-canvas"
              width={this.scaleImageWidth()}
              height={this.scaleImageHeight()}
              ref="progressiveMedia-canvas"
            >
            </canvas>
            <img
              className="progressiveMedia-image js-progressiveMedia-image"
              data-key={image.key}
              data-width={image.width}
              data-height={image.height}
              ref="progressiveMedia-image"
            />
            <div id="noscript" ref="noscript" className="js-progressiveMedia-inner">
              <img
                className="progressiveMedia-noscript js-progressiveMedia-inner"
                src={
                  parseImageUrl({
                    key: image.key,
                    width: image.width,
                    height: image.height,
                    q0: !0,
                    strategy: 'resample',
                  }, this.c)
                }
              />
              </div>
          </div>
        </div>
      </figure>
    );
  }
}
