import React from 'react';
import PropTypes from 'prop-types';
import { Header, HeaderRow, Badge, Icon, IconButton, Menu, MenuItem } from 'react-mdl';
import TabsComponent from '#app/common/components/Tabs';

const DashBar = ({ messageCount, goToUrl, title, tabs, location, routes }) => (
  <Header className="DashBar" scroll>
    <HeaderRow title={<span className="dash_title">{title}</span>} key={1}>
        <div className="DashBar__right">
          <Badge text={messageCount || '0'}>
            <Icon
              name="announcement"
              style={{ cursor: 'pointer' }}
              onClick={() => goToUrl('/messages')}
            />
          </Badge>
          <IconButton id="account-menu-toggle" name="account_circle" style={{ marginTop: '-15px' }} />
          <Menu
            target="account-menu-toggle"
            ripple
            className="mdl-shadow--3dp"
            valign="bottom"
            align="right"
            style={{ marginLeft: 0 }}
          >
            <MenuItem onClick={() => goToUrl('/')}>Home</MenuItem>
            <MenuItem><a href="/api/v1/users/logout" >Logout</a></MenuItem>
          </Menu>
        </div>
    </HeaderRow>
    <HeaderRow key={2} className="tab_container">
      <TabsComponent tabs={tabs} location={location} routes={routes}/>
    </HeaderRow>
  </Header>
);

DashBar.propTypes = {
  messageCount: PropTypes.number,
  goToUrl: PropTypes.func,
  title: PropTypes.string,
  onLogout: PropTypes.func,
};

export default DashBar;