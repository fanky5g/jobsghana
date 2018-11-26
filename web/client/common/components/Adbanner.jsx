import React, { PureComponent } from 'react';

class AdBanner extends PureComponent {

	componentDidMount() {
		(window.adsbygoogle = window.adsbygoogle || []).push({})
	}

	render() {
		const style = {
			display: 'block',
		};

		return(
			<ins className="adsbygoogle"
			     style={style}
			     data-ad-client="ca-pub-9059910099356276"
			     data-ad-slot={this.props.slot}
			     data-ad-format="auto">
			</ins>
		);
	}
}

export default AdBanner;