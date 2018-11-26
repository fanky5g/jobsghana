import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-mdl';

class TabComponent extends PureComponent {
	static propTypes = {
		tabs: PropTypes.array,
		location: PropTypes.object,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	state = {
		selectedTab: 0,
	};

    componentWillMount() {
      this.ensureDefaultNested();
    }

    componentDidUpdate() {
      this.ensureDefaultNested();
    }

    ensureDefaultNested() {
      const { router } = this.context;
      const { location, routes } = this.props;
      const currentRoute = routes[this.props.routes.length - 1];
      const routeParams = location.pathname.split('/');
      const childRouteIndex = 3;
      const childRoute = routeParams[childRouteIndex];

      if (typeof childRoute == 'undefined') {
        const { nestedRoutes } = currentRoute;
        if (nestedRoutes) {
          let defaultRoute = nestedRoutes.filter(route => route.default)[0];

          if (defaultRoute) {
            router.push(`${routeParams.join('/')}/${defaultRoute.path.replace('/', '')}`);
          }
        }
      }
    }

	componentWillReceiveProps(nextProps) {
		const { location, tabs } = nextProps;
		const routePaths = location.pathname.split('/');
		const thisRouteName = routePaths[routePaths.length - 1];

		if (thisRouteName) {
			const activeTab = tabs.findIndex(tab => {
				return tab.path === thisRouteName;
			});
			if (activeTab != -1) {
				this.setState({
					selectedTab: activeTab,
				});
			}
		}
	}

	selectTab = (tabId) => {
	    if (this.state.selectedTab === tabId) return;
	    const { router } = this.context;
	    const { tabs, location } = this.props;
	    const route = tabs[tabId].path;
	    const currentPath = location.pathname;
	    let parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));

	    if (parentPath == '') {
	    	parentPath = currentPath;
	    }
	    
	    const goTo = `${parentPath}/${route.replace('/', '')}`;

	    this.setState({
	      selectedTab: tabId,
	    }, () => {
	    	router.push(goTo);
	    });
	 };

	render() {
		const { tabs } = this.props;
		const { selectedTab } = this.state;

		return (
			<Tabs
	          activeTab={selectedTab}
	          onChange={this.selectTab}
	          className="Tab_container">
	          {
	          	tabs.map((tab, index) => (<Tab key={index}>{tab.name}</Tab>))
	          }
	        </Tabs>
		);
	}
}

export default TabComponent;