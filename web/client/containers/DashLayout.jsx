import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Header,
  Navigation,
  Drawer,
  Content,
  Icon,
} from 'react-mdl';
import Link from 'react-router/lib/Link';
import DashBar from '#app/common/components/DashBar';
import User from '#app/common/components/DashBarUser';
import DevTools from '#app/common/middleware/DevTools';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '#app/common/actions/Auth';
import { initEnvironment } from '#app/common/actions/App';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import NotificationComponent from '#app/common/components/NotificationComponent';
import { notify } from '#app/util/notify';
import { getMessages } from '#app/common/actions/Messages';


class DashLayout extends PureComponent {
  static propTypes = {
    routes: PropTypes.array,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.object,
    messages: PropTypes.array,
    messagesLoaded: PropTypes.bool,
  };

  state = {
    isMounted: false,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch, messagesLoaded } = this.props;
    if (!messagesLoaded) {
      dispatch(getMessages());
    }
  }

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({
      isMounted: true,
    });

    dispatch(initEnvironment());
    document.body.className = document.body.className.replace(/(^|\s)is-noJs(\s|$)/, "$1is-js$2");  
  };

  onLogout = () => {
    const { dispatch } = this.props;

    dispatch(logout());
  };

  action = () => {
    const { nAction } = this.state;
    this.setState({
      active: false,
    });
    if (typeof nAction === 'function') {
      nAction();
    }
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    if (dimmer) {
      dimmer.classList.remove('is-visible');
    }
  };

  generateLinks() {
    const navLinks = [{
      to: '/',
      name: 'Overview',
      icon: 'assessment',
    }, {
      to: '/accounts',
      name: 'Accounts',
      icon: 'supervisor_account',
    }, {
      to: '/post',
      name: 'Post',
      icon: 'mode_edit',
    }, {
      to: '/posts',
      name: 'Posts',
      icon: 'library_books',
    },
    {
      to: '/messages',
      name: 'Messages',
      icon: 'message',
    },
    {
      to: '/subscribers',
      name: 'Subscribers',
      icon: 'subscriptions',
    },
    //  {
    //   to: '/category',
    //   name: 'Blog Categories',
    //   icon: 'view_day',
    // }
    ];

    // const links = navLinks.filter((link) => link.allow.indexOf(type) !== -1);
    return navLinks;
  }

  goToUrl = (path) => {
    const { router } = this.context;
    router.push(path);
  };

  getNestedRoutes = () => {
    let routes = this.props.routes,
    nestedRoutes = [];

    if (routes && Array.isArray(routes)) {
      nestedRoutes = routes.reduceRight((prev, curr) => {
        if ((Array.isArray(prev) && prev.length == 0) && (typeof curr === 'object' && curr.hasOwnProperty('nestedRoutes'))) {
          return curr.nestedRoutes;
        }
        return prev;
      }, [])
    }

    return nestedRoutes;
  };

  isLinkActive = (link) => {
    const { location } = this.props;
    let isActive = (location.pathname.includes(link.to)) && link.to.replace('/', '') !== '';
    if ((location.pathname.replace('/', '') == '') && (link.to.replace('/', '') == '')) {
      isActive = true;
    }
    return isActive;
  };

  render() {
    const { user, dispatch, location } = this.props;
    const Avatar = user.avatar;
    const fullName = typeof user.resume != 'undefined' ? user.resume.basics.name : user.email;
    const links = this.generateLinks();
    const currentRoute = this.props.currentRoute;

    const { isMounted } = this.state;

    let tabs = this.getNestedRoutes();
    const hasTabs = tabs.length > 0;
    // remove after we done actually sending messages to users
    const messages = this.props.messages || [];

    const htmlString = 'This site is not intended to function without JavaScript, turn on JavaScript OR\
      <a href="http://browsehappy.com"> update your browser<a>';

    return (
      <div
        style={{ minHeight: '100%', height: '100%', position: 'relative' }}
        className={classnames({Dashboard: true, tabsActive: hasTabs})}
      >
        <Layout  fixedDrawer id="dashMain">
          {isMounted && <DevTools />}
          {isMounted && <NotificationComponent />}
          <DashBar
            title={currentRoute.name}
            messageCount={messages.filter($message => !$message.read).length}
            goToUrl={this.goToUrl}
            onLogout={this.onLogout}
            tabs={tabs}
            routes={this.props.routes}
            location={location}
          />
          <Helmet title={`${currentRoute.name}`} />
          <Drawer onClick={this.toggleDrawer}>
            <Link to="/" className="brand">
              <img className="icon" src="/static/images/logo-web-light.png" />
            </Link>
            <Navigation className="sideNav">
            {
              isMounted &&
              links.map((link, index) => (
                <Link
                  to={link.to}
                  key={index}
                  activeClassName="active"
                  onlyActiveOnIndex={link.to=='/'}
                >
                  <span className="link-title">{link.name}</span>
                  <Icon name={link.icon} className="link-icon" />
                </Link>
              ))
            }
            </Navigation>
          </Drawer>
          <Content className={classnames({DashContent: true, hasTabs: hasTabs})}>
              <div className="dash_main">
                {
                  this.props.children && React.cloneElement(this.props.children, {
                    user,
                    dispatch,
                    messages,
                  })
                }
              </div>
          </Content>
        </Layout>
        <noscript dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.Messages.toJSON().data,
  messagesLoaded: state.Messages.toJSON().loaded,
});

export default connect(mapStateToProps)(DashLayout);