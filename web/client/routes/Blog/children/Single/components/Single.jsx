import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import { getSingle, getRelated } from '../actions';
import { displayDate } from '#app/util/date';
import showdown from 'showdown';
import Link from 'react-router/lib/Link';
import DisqusThread from './DisqusThread';
import { bindActionCreators } from 'redux';
import ProgressiveHeader from './ProgressiveHeader';
import Compile from './Compile';
import Header from './Header';

class BlogSingle extends PureComponent {
  static propTypes = {
    post: PropTypes.object,
    loading: PropTypes.bool,
    rloading: PropTypes.bool,
    related: PropTypes.array,
    rloaded: PropTypes.bool,
    location: PropTypes.object,
    currLocation: PropTypes.string,
    dispatch: PropTypes.func,
    actionResult: PropTypes.string,
    screenWidth: PropTypes.number.isRequired,
    screenHeight: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      EMAIL: '',
      isMounted: false,
      disqusVisible: false,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if ((nextState.EMAIL == this.state.EMAIL) &&
  //     (nextState.isMounted == this.state.isMounted) &&
  //     (nextState.disqusVisible == this.state.disqusVisible)) {
  //     return false;
  //   }
  //   return true;
  // }

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  fieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  showDisqus = () => {
    this.setState({
      disqusVisible: true,
    });
  };

  render() {
    const { post, loading, related, rloaded, actionResult, screenWidth, screenHeight, currLocation } = this.props;
    const { isMounted } = this.state;

    let authorName = '';
    let authorImg = '';

    if (post.ID) {
      authorName = post.ip_owner;
      authorImg = post.author.avatar;
    }

    // const converter = new showdown.Converter();
    let header;
    if (post.hasOwnProperty('ID')) {
      header = post.images[post.headerImageIndex];
    }

    let rendered = [];
    if (typeof post.ID != 'undefined' && post.content != '') {
      rendered = Compile(post.content, this).tree;
    }

    return (
      isMounted &&
      <article className="postArticle u-sizeViewHeightMin100">
        {
          post && post.hasOwnProperty('ID') &&
            <main className="postArticle-content js-postField js-notesSource" data-scroll="native">
              <section className=" section--body section--first section--last">
                <div className="section-divider layoutSingleColumn">
                  <hr className="section-divider" />
                </div>
                <Header userImg={authorImg} userName={authorName} createdAt={post.pub_date} title={post.title}></Header>
                <div className="section-content">
                  <ProgressiveHeader
                    image={header}
                    isMounted={isMounted}
                    clientWidth={screenWidth}
                    clientHeight={screenHeight}
                    location={currLocation}
                  />
                  <div className="margin-top-10"></div>
                  <div className="section-inner sectionLayout--insetColumn">
                    {
                      rendered
                    }
                  </div>
                  <div className="section-inner layoutSingleColumn">
                    {
                      rloaded && related.length > 0 &&
                        <section className="related">
                          <div className="title">
                            <h3>Related Articles</h3>
                          </div>
                          {
                            related.map(($post, index) => (
                              <div className="related-list relatedthumb" key={index}>
                                <Link to={`/career-advice/${$post.shorturl}`} className="image-list">
                                  <div className="img-wrap " style={{ width: '161px', height: '112px' }}>
                                    <div
                                      className="img"
                                      style={{
                                        background: `url(${$post.attachments[0][0]}) 50% 50% no-repeat`,
                                        width: '161px',
                                        height: '112px',
                                        marginBottom: '5px',
                                        backgroundSize: 'cover',
                                      }}
                                    >
                                    </div>
                                  </div>
                                </Link>
                                <Link
                                  className="link-list text--title"
                                  to={`/career-advice/${$post.shorturl}`}
                                  style={{ fontSize: '20px', lineHeight: '28px' }}
                                >
                                  {$post.title}
                                </Link>
                                <span className="text" style={{ fontSize: '16px' }}>
                                  {$post.abstract}
                                </span>
                              </div>
                            ))
                          }
                        </section>
                    }
                    {
                      !loading && post && isMounted &&
                        <aside className="single-disqus" style={{overflow: 'hidden'}}>
                          <h3 className="small-title" style={{color: '#222'}}>Comment on this post</h3>
                          <DisqusThread
                            shortname="talentsinafrica"
                            identifier={`${post.shorturl}`}
                            title={post.title}
                          />
                        </aside>
                    }
                  </div>
                </div>
              </section>
            </main>
        }
      </article>
    );
  }
}

const getData  = (getState, dispatch, shorturl) => {
  const post = getState().Post.toJSON().post;
  // const loaded = typeof post != 'undefined' && post.ID != undefined;
  // if (!loaded) {
    const isActive = post ? post.shorturl === shorturl : false;
    const promises = [];

    if (!isActive) {
      promises.push(dispatch(getSingle(shorturl)));
      // promises.push(dispatch(getRelated(shorturl)));
    }
    return Promise.all(promises);
  // }
};

const hooks = {
  fetch: ({ dispatch, store: { getState }, params: { shorturl } }) => {
    return getData(getState, dispatch, shorturl);
  },
  defer: ({ dispatch, store: { getState }, params: { shorturl } }) => {
    return getData(getState, dispatch, shorturl);
  },
};

const mapStateToProps = (state) => ({
  post: state.Post.toJSON().post,
  related: state.Post.toJSON().related,
  rloading: state.Post.toJSON().rloading,
  rloaded: state.Post.toJSON().rloaded,
  loading: state.Post.toJSON().loading,
  currLocation: state.SourceRequest.get('location'),
  screenWidth: Number(state.Environment.toJSON().screenWidth),
  screenHeight: Number(state.Environment.toJSON().screenHeight),
});

export default provideHooks(hooks)(connect(mapStateToProps)(BlogSingle));
