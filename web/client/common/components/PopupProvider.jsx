import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import InteractionProvider from '#app/lib/InteractionProvider';
import Popup from '#app/common/components/PopupChild';
import { openPopup, closePopup, addVisitedPopup, setPopupLength } from '#app/common/actions/Popup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '#app/common/components/Confirm';
import ReactDOM from 'react-dom';

class PopupContainer extends PureComponent {
  static propTypes = {
    timeout: PropTypes.number,
    onActive: PropTypes.func,
    onInactive: PropTypes.func.isRequired,
  };

  static defaultProps = {
    timeout: 60 * 1000 // 1m
  };

  static contextTypes = {
    interactionProvider: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
  	if (this.subscription) {
  		this.subscription.remove();
  	}

  	if (nextProps.subscribe && !nextProps.active) {
  		this.subscription = this.context.interactionProvider.subscribe(
	      nextProps.timeout,
	      nextProps.onActive,
	      nextProps.onInactive,
	    );
  	}
  }

  componentWillUnmount() {
  	if (this.subscription) {
  		this.subscription.remove();
  	}
  }

  render() {
    const {
      timeout,
      onActive,
      onInactive,
      children,
      ...props
    } = this.props;

    const child = React.Children.only(children);
    return React.cloneElement(child, props);
  }
}

class PopupProvider extends PureComponent {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		goToUrl: PropTypes.func.isRequired,
	};

	state = {
		isMounted: false,
	};

	componentDidMount() {
		const { dispatch, components } = this.props;
		this.setState({
			isMounted: true,
		});
		
		dispatch(setPopupLength(components.length));
	}

	isNextPopup(index) {
		const { visitedPopups, popupActive, dispatch } = this.props;
		const { isMounted } = this.state;

		if (!isMounted) return false;

		const isVisited = () => {
			const position = visitedPopups.findIndex(item => item == index);
			return position !== -1;
		};

		const isNext = visitedPopups.length == index && !isVisited(index);
		return isNext;
	}

	open = (component, index) => {
		const { components, visitedPopups, popupActive, dispatch, activePopup } = this.props;

		if (popupActive) {
			return;
		}

      	dispatch(openPopup());
	};

	render() {
		const seedTime = 5;
		const { components, visitedPopups, popupActive, goToUrl, dispatch, activePopup } = this.props;
		let component = null;
		let activeComponent = activePopup;

		if (activePopup) {
			component = components[activePopup];
		}

		if (component == null && components.length) {
			component = components[0];
			activeComponent = 0;
		} else {
			activeComponent = activePopup;
		}

		const isNext = this.isNextPopup(activeComponent);
		const active = isNext && popupActive;
		const multiplier = (activeComponent ? seedTime : 1) * (activeComponent + 1);

		return (
			<InteractionProvider>
				<PopupContainer
					{...this.props}
					subscribe={isNext}
					onActive={null}
					timeout={component.timeout * multiplier}
					onInactive={() => {
						this.open(component, activeComponent);
						component.onInactive();
					}}
					active={active}
				>
					<Popup
					active={active}
					closePopup={bindActionCreators(closePopup, dispatch)}
					goToUrl={this.props.goToUrl}
					header={component.header}
					content={component.content}
					footer={component.footer}
					componentIndex={activeComponent}
					visited={bindActionCreators(addVisitedPopup, dispatch)}
					requiresAction={component.requiresAction}
					action={component.action}
					processing={this.props.processing}
					actionComplete={this.props.actionComplete}
					message={this.props.message}
					dispatch={dispatch}
				  />
				</PopupContainer>
			</InteractionProvider>
		);
	}
}

const mapStateToProps = (state) => ({
  popupActive: state.Popup.get('popupActive'),
  activePopup: state.Popup.get('activePopup'),
  visitedPopups: state.Popup.toJSON().visitedPopups,
  processing: state.Popup.get('processing'),
  actionComplete: state.Popup.get('actionComplete'),
  message: state.Popup.get('message'),
});

export default connect(mapStateToProps)(PopupProvider);