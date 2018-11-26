import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';
import { parseImageUrl, drawCanvasWithBlur, Iba, In, Jn, getClass, getClassName, getClassMaxWidth, getClassMaxHeight, getSectionClassName } from '#app/lib/util';
import classnames from 'classnames';


export default class ProgressiveImage extends PureComponent {
  static propTypes = {
    isMounted: PropTypes.bool.isRequired,
    image: PropTypes.object.isRequired,
    clientWidth: PropTypes.number.isRequired,
    clientHeight: PropTypes.number.isRequired,
    location: PropTypes.string,
  };

  constructor(props) {
  	super(props);
  }

  componentDidMount() {
    this.c = Iba(this.props.clientWidth, this.props.currLocation);
  	document.addEventListener('scroll', throttle(this.loadImage, 1000), true);
  	this.loadProgressive();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.loadImage);
  }

  loadImage = () => {
    const image = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);

    if (this.isVisible() && (image && (!image.complete || image.naturalWidth === 0))) {
      image.src = parseImageUrl({
        url: image.dataset.url,
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
    const CANVAS_BLUR_RADIUS = 8;
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);
    const canvas = ReactDOM.findDOMNode(this.refs['progressiveMedia-canvas']);
    const thumbnail = ReactDOM.findDOMNode(this.refs['progressiveMedia-thumbnail']);
    const image = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    const classGroup = getClass(image.dataset.width, image.dataset.height);
    this.setClasses(classGroup, image.dataset.height, image.dataset.width);

    const onThumbnailLoad = () => {
      drawCanvasWithBlur(canvas, thumbnail, CANVAS_BLUR_RADIUS);
      component.classList.add('is-canvasLoaded');
      if (this.isVisible()) this.loadImage();
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
      return node.currentStyle ? node.currentStyle.display : getComputedStyle(node, null).display;
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
  	if (image.width > image.height) {//landscape
  		return Math.round((75 * image.height) / image.width);
  	}
  	return 75;
  };

  scaleImageWidth = () => {
  	const { image } = this.props;
  	if (image.height > image.width) {//landscape
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
    const sectionClassName = getSectionClassName(classGroup);

  	return (
  		<div className={classnames({"section-inner": true, [sectionClassName]: true})} ref="section">
            <figure className={classnames({"graf--figure": true, "graf-after--h3": true, [className]: true})} ref="grafFigure">
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
                  data-url={image.url}
                  data-action="zoom"
                  data-action-value={image.key}
                  data-scroll="native"
                  ref="progressiveMedia"
                >
                  <img
                    data-key={image.key}
                    data-width={image.width}
                    data-height={image.height}
                    data-url={image.url}
                    src={
                      parseImageUrl({
                        ...image,
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
                    data-url={image.url}
                    ref="progressiveMedia-image"
                  />
                  <div id="noscript" ref="noscript" className="noscript js-progressiveMedia-inner">
                    <img
                      className="progressiveMedia-noscript js-progressiveMedia-inner"
                      src={
	                      parseImageUrl({
                        ...image,
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
          </div>
  	);
  }
}