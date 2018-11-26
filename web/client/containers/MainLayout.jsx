import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Link from 'react-router/lib/Link';
import {
  Header,
  Navigation,
  Drawer,
  HeaderRow,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Layout,
} from 'react-mdl';
import { Upload } from 'antd';
import classnames from 'classnames';
import { logout } from '#app/common/actions/Auth';
import PopupProvider from '#app/common/components/PopupProvider';
import {popups} from '#app/common/components/Popups';

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

export default class MainLayout extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.object,
    location: PropTypes.object,
    isMounted: PropTypes.bool,
    saveAction: () => {},
  };

  state = {
    collapsed: true,
    current: '',
    menuActive: false,
    canCloseMenu: true,
    popupActive: false,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleClick = (e) => {
    const { router } = this.context;
    this.setState({
      current: e.key,
      menuActive: false,
    });

    router.push(e.key);
  };

  toggleMenu = () => {
    this.setState({
      menuActive: !this.state.menuActive,
    });
  };

  closeMenu = () => {
    if (!this.state.canCloseMenu) return;
    this.setState({
      menuActive: false,
    });
  };

  openMenu = () => {
    this.setState({
      menuActive: true,
    });
  };

  keepMenuOpen = () => {
    this.setState({
      canCloseMenu: false,
    });
  };

  menuCanClose = () => {
    this.setState({
      canCloseMenu: true,
    });
  };

  registerSaveAction = (action) => {
    this.setState({
      saveAction: action,
    });
  };

  callSaveAction = () => {
    if (typeof this.state.saveAction == "function") {
      this.state.saveAction();
    }
  };

  goToUrl = (path, query, state) => {
    const { router } = this.context;

    const hostname = getLocation(path).hostname;
    if (hostname.indexOf('talentsinafrica') == '-1') {
      return window.open(path, '_blank');
    }

    router.push({
      pathname: path,
      query,
      state,
    });
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    if(dimmer) {
      dimmer.classList.remove('is-visible');
    }
  };

  render() {
    const { children, pageName, isAuthenticated, screenWidth, isMounted, isMobile } = this.props;
    const { current, menuActive } = this.state;

    // const transition = this.getTransition();

    return (
        <Layout id="main">
          {
            isMounted && !isMobile &&
            <PopupProvider
              components={popups}
              dispatch={this.props.dispatch}
              goToUrl={this.goToUrl}
            />
          }
          <Header className="header">
            <HeaderRow className="container">
              <div className="brand">
                <li className="brand">
                  <Link to="/">
                    <img  src="/static/images/logo-web-light.png" />
                  </Link>
                </li>
              </div>
              <Navigation>
                <li>
                  <Link to="/" activeClassName="active" onlyActiveOnIndex>Home</Link>
                </li>
                <li>
                  <Link to="/find-job" activeClassName="active" onlyActiveOnIndex>Job Seekers</Link>
                </li>
                <li>
                  <Link to="/cv-alert" activeClassName="active" onlyActiveOnIndex>Resume Alerts</Link>
                </li>
                <li>
                  <Link to="/career-advice" activeClassName="active" onlyActiveOnIndex>Career Advice</Link>
                </li>
              </Navigation>
              <Navigation>
                <li>
                  <div className="lang-nav">
                    <ul className="no-js" id="region">
                      <li className="lang">
                        <a id="lang-current"><img src="/static/images/gh_flag.jpg" /><span> Ghana</span></a>
                        {
                        // <ul id="nav-opt">
                        //   <li>
                        //     <a href="#"><img src="" /> Ghana</a>
                        //   </li>
                        //   <li>
                        //     <a href="#"><img src="" /> Nigeria</a>
                        //   </li>
                        // </ul>
                        }
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="showOnlyJS">
                  {
                    isAuthenticated &&
                      <div>
                        <IconButton id="account-menu" name="account_circle" />
                        <Menu
                          target="account-menu"
                          ripple
                          className="mdl-shadow--3dp AppBar__menu-item-dropdown"
                        >
                          <MenuItem onClick={() => this.goToUrl('/me')}>My Profile</MenuItem>
                          <MenuItem><a href="/api/v1/users/logout">Logout</a></MenuItem>
                        </Menu>
                      </div>
                  }
                  {
                    !isAuthenticated &&
                    <a href="javascript:void(0)" className="active" onClick={() =>
                          this.goToUrl('/login', {}, { transition: 'slideLeftTransition' })}>Login</a>
                  }
                </li>
                <li className="noscript">
                  {
                    isAuthenticated &&
                    <Link to="/me">My Profile</Link>
                  }
                  {
                    isAuthenticated &&
                    <a href="/api/v1/users/logout">Logout</a>
                  }
                  {
                    !isAuthenticated &&
                      <Link to="/login">Login</Link>
                  }
                </li>
                <li>
                  <Link to="find-resume" activeClassName="active">Recruiting?</Link>
                </li>
                <li>
                  <Link to="resume" activeClassName="active">Register CV</Link>
                </li>
              </Navigation>
            </HeaderRow>
          </Header>
          <Drawer onClick={this.toggleDrawer}>
            <Navigation>
              <li>
                <Link to="/" activeClassName="active" onlyActiveOnIndex>Home</Link>
              </li>
              <li>
                <Link to="/find-job" activeClassName="active" onlyActiveOnIndex>Job Seekers</Link>
              </li>
              <li>
                <Link to="/cv-alert" activeClassName="active" onlyActiveOnIndex>Resume Alerts</Link>
              </li>
              <li>
                <Link to="/career-advice" activeClassName="active" onlyActiveOnIndex>Career Advice</Link>
              </li>
              <li>
                <Link to="find-resume" activeClassName="active">Recruiting?</Link>
              </li>
              <li>
                <Link to="resume" activeClassName="active">Register CV</Link>
              </li>
              {
                isAuthenticated &&
                <li>
                  <Link to="/me">My Profile</Link>
                </li>
              }
              {
                isAuthenticated &&
                <li>
                  <a href="/api/v1/users/logout">Logout</a>
                </li>
              }
              {
                !isAuthenticated &&
                <li>
                  <Link to="/login">Login</Link>
                </li>
              }
            </Navigation>
          </Drawer>
            {
              React.cloneElement(children, {
                goToUrl: this.goToUrl,
                registerSaveAction: this.registerSaveAction,
                isMobile,
              })
            }
        </Layout>
    );
  }
}