import React from 'react';
import { displayDate } from '#app/util/date';
import { parseImageUrl } from '#app/lib/util';

const Header = ({userImg, userName, createdAt, title}) => (
	<header className="container u-maxWidth740">
		<div className="postMetaHeader u-paddingBottom10 row">
			<div className="col u-size12of12 js-postMetaLockup">
				<div className="postMetaLockup postMetaLockup--authorWithBio u-flex js-postMetaLockup">
					<div className="u-flex0">
						<a href="#" className="link avatar u-baseColor--link">
						  <img
						  	src={parseImageUrl({
						  		  url: userImg,
							      key: userImg,
							      width: 60,
							      height: 60,
							      strategy: 'resample',
							      quality: 80,
							    })}
						  	className="avatar-image avatar-image--small"
						  	alt="avatar" />
						  </a>
					</div>
					<div className="u-flex1 u-paddingLeft15 u-overflowHidden">
						<div className="postMetaInline u-noWrapWithEllipsis u-xs-normalWrap u-xs-lineClamp2" style={{fontSize: "14px"}}>{title}</div>
						<div className="postMetaInline js-testPostMetaInlineSupplemental">
							<time dateTime={createdAt}>{displayDate(createdAt)}</time>
						</div>
						<span className="postMetaInline u-noWrapWithEllipsis u-xs-normalWrap u-xs-lineClamp2">
							{userName}
						</span>
					</div>
				</div>
			</div>
		</div>
	</header>
);

export default Header;
