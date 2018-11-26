import React, { PureComponent } from 'react';

class PopupComponent extends PureComponent {
	render() {
		return (
			<div id="modalExitIntent" className="modal fade in" tabindex="-1" role="dialog" style={{display: "block"}}>
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
							<h4 className="modal-title" id="modalExitIntentLabel">Who Doesn't Love a Parting Gift?</h4>
						</div>
						<div className="modal-body">
							<div className="at-above-post addthis_default_style addthis_toolbox at-wordpress-hide" data-title="Building with React &amp; Flux: Hello React Banners" data-url="https://wwwtc.wpengine.com/blog/building-with-react-flux-hello-react-banners/">
								<div className="atclear"></div>
							</div>
							<p>
								<strong>The Topcoder Newsletter:</strong>
								3 Unique Crowdsourcing Stories. Delivered to Your Inbox. 1x Per Month. With a Bow on Top.
							</p>
							<div className="at-below-post addthis_default_style addthis_toolbox at-wordpress-hide" data-title="Building with React &amp; Flux: Hello React Banners" data-url="https://wwwtc.wpengine.com/blog/building-with-react-flux-hello-react-banners/">
								<div className="atclear"></div>
							</div>
							<div className="at-below-post-recommended addthis_default_style addthis_toolbox at-wordpress-hide">
								<div className="atclear"></div>
							</div>
						</div>
						<div className="modal-footer">
							<a href="http://crowdsourcing.topcoder.com/topcoder_newsletter" target="_blank" class="btn-blue">Subscribe Today</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PopupComponent;