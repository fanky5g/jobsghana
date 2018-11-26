import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Link from 'react-router/lib/Link';
import { parseImageUrl, drawCanvasWithBlur, Iba } from '#app/lib/util';
import classnames from 'classnames';
import { throttle } from 'lodash';

export default class BlogEntry extends PureComponent {
  static propTypes= {
    clientWidth: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.c = Iba(this.props.clientWidth, this.props.currLocation);
  }

  componentDidMount() {
    document.addEventListener('scroll', throttle(this.loadImage, 1000), true);

    const CANVAS_BLUR_RADIUS = 8;
    const component = ReactDOM.findDOMNode(this.refs.progressiveMedia);
    const canvas = ReactDOM.findDOMNode(this.refs['progressiveMedia-canvas']);
    const thumbnail = ReactDOM.findDOMNode(this.refs['progressiveMedia-thumbnail']);

    const onThumbnailLoad = () => {
      drawCanvasWithBlur(canvas, thumbnail, CANVAS_BLUR_RADIUS);
      component.classList.add('is-canvasLoaded');
      setTimeout(() => {
        this.loadImage();
      }, 1000);
    };

    if (thumbnail && (!thumbnail.complete || thumbnail.naturalWidth === 0)) {
      thumbnail.addEventListener('load', function onImageLoaded() {
        thumbnail.removeEventListener('load', onThumbnailLoad);
        onThumbnailLoad();
      });
    } else {
      onThumbnailLoad();
    }

    const aspectRatioFill = ReactDOM.findDOMNode(this.refs['aspectRatioPlaceholder-fill']);
    aspectRatioFill.style.paddingBottom = '30%';
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
        width: 800,
        height: 240,
        strategy: 'crop-fixed',
      }, this.c);

      image.addEventListener('load', (function onImageLoaded() {
        image.removeEventListener('load', onImageLoaded);
        setTimeout(() => {
          component.classList.add('is-imageLoaded');
        }, 1000);
      }).bind(this));
    }
  };

  getDisplayState = () => {
    const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
    if (node) {
      return node.currentStyle ? node.currentStyle.display : getComputedStyle(node, null).display;
    }
  };

  isVisible = () => {
    if (typeof document != 'undefined' && process.env.BROWSER) {
      if (this.getDisplayState() === 'none') {
        return false;
      }
      const node = ReactDOM.findDOMNode(this.refs['progressiveMedia-image']);
      if (node) {
        const rect = node.getBoundingClientRect();
        return (
          (rect.height > 0 || rect.width > 0) &&
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
      }
    }
    return true;
  };

  render() {
    const { post, isMounted, isMobile } = this.props;
    const header = post.images[post.headerImageIndex];

    return (
      <div className={classnames({postCard: true, cardChromeless: true, "card--borderRadius3": true, "mdl-shadow--2dp": !isMobile})}>
        <div className="postCardInner">
          <div className="postArticle postArticle--short">
            <div className="layoutSingleColumn">
              <div className="postArticle-content blog-entry">
                <figure className="graf--figure graf--layoutCroppedHeightPreview graf--leading">
                  <div className="aspectRatioPlaceholder is-locked">
                    <div className="aspectRatioPlaceholder-fill" ref="aspectRatioPlaceholder-fill"></div>
                    <div
                      className="progressiveMedia js-progressiveMedia graf-image"
                      ref="progressiveMedia"
                      data-url={header.url}
                      data-key={header.key}
                      data-width={header.width}
                      data-height={header.height}
                      data-scroll="native"
                    >
                        <img
                          src={
                            parseImageUrl({
                              ...header,
                              width: 30,
                              height: 9,
                              strategy: 'crop-fixed',
                            })
                          }
                          data-key={header.key}
                          data-width={header.width}
                          data-height={header.height}
                          crossOrigin="anonymous"
                          className={classnames({'progressiveMedia-thumbnail': true, 'js-progressiveMedia-thumbnail': true, showOnlyJS: true})}
                          ref="progressiveMedia-thumbnail"
                        />
                        <canvas
                          className={classnames({'progressiveMedia-canvas': true, 'js-progressiveMedia-canvas': true, showOnlyJS: true})}
                          ref="progressiveMedia-canvas"
                          width="75"
                          height="22"
                        >
                        </canvas>
                        <Link
                          to={`/career-advice/${post.shorturl}`}>
                          <img
                            className={classnames({'progressiveMedia-image': true, 'js-progressiveMedia-image': true, showOnlyJS: true})}
                            ref="progressiveMedia-image"
                            data-url={header.url}
                            data-key={header.key}
                            data-width={header.width}
                            data-height={header.height}
                            crossOrigin="anonymous"
                          />
                        </Link>
                        <div id="noscript" ref="noscript" className="js-progressiveMedia-inner">
                          <Link
                            to={`/career-advice/${post.shorturl}`}>
                            <img
                              className="progressiveMedia-noscript js-progressiveMedia-inner"
                              src={
                                parseImageUrl({
                                  ...header,
                                  width: 800,
                                  height: 240,
                                  strategy: 'crop-fixed',
                                })
                              }
                            />
                          </Link>
                        </div>
                    </div>
                  </div>
                </figure>
              </div>
              <h3 className="graf--h3 graf-after--figure graf--last graf--title">
                {post.title}
              </h3>
              <p className="graf--p graf-after--h3 graf--last">
                {`${post.abstract}...`}
              </p>
            </div>
            <div className="postArticle-readMore padding-right-10">
              <Link
                className="button button--smaller button--chromeless u-baseColor--buttonNormal is-touched"
                to={`/career-advice/${post.shorturl}`}
              >
                Read more…
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}