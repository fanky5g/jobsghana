import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getPosts } from '#app/common/actions/Posts';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import RegisterForm from '#app/common/components/Register';
import Link from 'react-router/lib/Link';
import { displayDate } from '#app/util/date';
import { bindActionCreators } from 'redux';
import BlogHead from './components/BlogHead';
import BlogEntry from './components/BlogEntry';
import { throttle } from 'lodash';
import AdBanner from '#app/common/components/Adbanner';
import MiniFooter from '#app/common/components/MiniFooter';
import classnames from 'classnames';

class Blog extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    posts: PropTypes.array,
    types: PropTypes.array,
    grouped: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      active: '',
      isMounted: false,
    };
  }

  componentWillMount() {
    if (!this.state.active && this.props.types.length) {
      this.setActive(this.props.types[0].type);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextState.active && nextProps.types.length) {
      this.setActive(nextProps.types[0].type);
    }
  }

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
    document.addEventListener('scroll', throttle(this.onScroll, 1000));
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const sidebar = document.querySelector('#blog-sidebar');
    const sidebarContainer = document.querySelector('.sidebar');

    if (window.innerWidth > 850) {
      if (document.body.scrollTop > 64) {
        if (sidebarContainer && !sidebarContainer.classList.contains('sidebarEase')) {
          sidebarContainer.classList.add('sidebarEase');
        }
        if (sidebar) {
          sidebar.style.top = '10px';
          sidebar.style.position = 'fixed';
          sidebar.style.width = '317px';
        }
      } else {
        if (sidebarContainer && sidebarContainer.classList.contains('sidebarEase')) {
          sidebarContainer.classList.remove('sidebarEase');
        }
        if (sidebar && sidebar.attributes.hasOwnProperty('style')) {
          sidebar.attributes.removeNamedItem('style');
        }
      }
    }
  };

  setActive = (type) => {
    this.setState({
      active: type,
    });
  };

  render() {
    const { posts, types, clientWidth, location, isMobile } = this.props;
    const { active, isMounted } = this.state;
    const published = posts.filter(post => post.published);

    return (
      isMounted &&
      <div className="Blog u-sizeViewHeightMin100">
        <div className="container clearfix">
          <div className="main-left">
            {
              // types.length > 0 &&
              //   <BlogHead types={types} active={active} setActive={this.setActive} />
            }
            {
              published.length > 0 &&
              published.filter(pub => pub.type === active).map((post, index) => {
                return (
                  <BlogEntry post={post} key={index} isMounted={isMounted} clientWidth={clientWidth} location={location} />
                );
              })
            }
            {
              published.length === 0 &&
                <div className="empty" style={{ textAlign: 'center' }}>
                  <span>No posts added...</span>
                </div>
            }
          </div>
          <div className="main-right">
            <aside className={classnames({"widget-area": true, sidebar: true, "mdl-shadow--2dp": !isMobile})}>
              <div ref="sidebar">
                <section id="blog-sidebar">
                  <div className="sidebar-sign">
                    <p>
                      Subscribe to receive Career Advice and Job information.
                    </p>
                    <p><strong>Enter your email below:</strong></p>
                    <RegisterForm isMobile={isMobile} />
                  </div>
                </section>
              </div>
            </aside>

            {
              // <aside className="widget-area sidebar ad-section">
              //   <div>
              //     <AdBanner slot="4024293851" />
              //   </div>
              // </aside>
            }
          </div>
        </div>
        <div className="padding-top-40"></div>
        <div className="container">
          <MiniFooter isMobile={isMobile}/>
        </div>
      </div>
    );
  }
}

const hooks = {
  fetch: ({ dispatch, store: { getState } }) => {
    const postsLoaded = getState().Posts.toJSON().loaded;
    if (!postsLoaded) {
      return Promise.resolve(dispatch(getPosts()));
    }
    return Promise.resolve();
  },
};

const mapStateToProps = (state) => ({
  loading: state.Posts.toJSON().loading,
  posts: state.Posts.toJSON().data,
  grouped: state.Posts.toJSON().grouped,
  types: state.Posts.toJSON().types,
  location: state.SourceRequest.get('location'),
  clientWidth: state.Environment.get('screenWidth'),
});

export default provideHooks(hooks)(connect(mapStateToProps)(Blog));
