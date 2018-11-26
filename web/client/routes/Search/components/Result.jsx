import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Link from 'react-router/lib/Link';
import { displayDate } from '#app/lib/date';
import { getYearsOfExperience } from '#app/util/resume';
import { Preview } from './ResumePreview';
import { elementInViewport } from '#app/util/common';
import { connect } from 'react-redux';
import { downloadUserResume } from '#app/routes/preview-resume/actions';

class Result extends PureComponent {
    downloadResume = (index) => {
        const { dispatch, entry } = this.props;
        dispatch(downloadUserResume(entry.uid));
    };

    openPreview = () => {
        const { entry, shead, id } = this.props;
        const previewPane = document.getElementById("preview-pane");
        const previewInner = previewPane.childNodes[0];
        const searchHead = ReactDOM.findDOMNode(shead);
        const thischild = ReactDOM.findDOMNode(this.refs["resume-entry"]);
        const firstchild = document.getElementById("resume-entry-0");
        const pointer = document.getElementById("preview_pointer");

        const preview = <Preview
            resume={entry.resume}
            last_updated={displayDate(entry.last_updated)}
            uid={entry.uid}
            formatDate={displayDate}
        />;

        if (previewPane && thischild) {
            const { screenWidth, screenHeight } = this.props;
            const childAttrs = thischild.getBoundingClientRect();
            const firstchildAttrs = firstchild.getBoundingClientRect();
            var midFirst = (0.5 * (firstchildAttrs.height - 20)) + firstchildAttrs.top;
            var pointerPos = (firstchildAttrs.height * id) + midFirst;

            var height = screenHeight;
            var offSetTop = (firstchildAttrs.top);
            var offSetWidth = (childAttrs.left + childAttrs.width) - 10;
            var pTop = 0;

            if (elementInViewport(searchHead)) {
                var top = screenHeight - offSetTop;
                height = height - offSetTop;
                pTop = offSetTop;
            }

            previewPane.style.width = `${screenWidth - offSetWidth}px`;
            previewPane.style.top = `${pTop}px`;
            previewPane.style.left = `${offSetWidth}px`;
            previewPane.style.height = `${height}px`;
            previewPane.style.display = 'block';

            pointer.style.top = `${pointerPos}px`;
            pointer.style.left = `${offSetWidth - 15}px`;
            pointer.style.position = 'absolute';
            pointer.style.display = 'block';

            ReactDOM.render(preview, previewPane);
        }
    };

	render() {
        const { entry, screenWidth, screenHeight, id } = this.props;

		return (
            (() => {
                if (this.props.type == 'job') {
                    return (
                        <div className="row  result">
                            {
                                entry.desc &&
                                <h2 className="jobtitle">
                                    <Link to={entry.url}
                                        target="_blank">
                                        {entry.desc}
                                    </Link>
                                </h2>
                            }
                            {
                                entry.company &&
                                <span className="company">
                                    <span itemProp="name">
                                        <Link onClick={()=>{}}>
                                            {entry.company}
                                        </Link>
                                    </span>
                                </span>
                            }
                            {
                                entry.company && entry.region &&
                                <span>&nbsp;-&nbsp;</span>
                            }
                            {
                                entry.region &&
                                <span>
                                    <span className="location">
                                        <span>{entry.region}</span>
                                    </span>
                                </span>
                            }
                            {
                                entry.posted_on &&
                                <table cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td className="snip">
                                                <div className="result-link-bar-container">
                                                    <div className="result-link-bar">
                                                        <span className="date">posted:&nbsp;{displayDate(entry.posted_on)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                        </div>
                    );
                } else if (this.props.type == 'resume') {
                    const experience = getYearsOfExperience(entry.work_timerange);
                    let yearsOfExperience = 'entry level';
                    if (experience) {
                        yearsOfExperience = `${experience} yrs experience`;
                    }

                    return (
                        <div className="row result resumeentry" id={`resume-entry-${id}`} ref="resume-entry" style={{width: '595px'}} onMouseEnter={this.openPreview}>
                            <div className="resumename">
                                <Link to="/"
                                    target="_blank">
                                    {entry.jobTitle}
                                </Link>
                                &nbsp;-&nbsp;
                                <span className="location">{entry.location}</span>
                                <span className="experience">&nbsp;-&nbsp;{yearsOfExperience}</span>
                            </div>
                            {
                                Array.isArray(entry.skills) &&
                                entry.skills.map((skill, index) => {
                                    return (
                                        <div className="skill" key={index}>
                                            {skill.name} - &nbsp;
                                            <span className="level">{skill.level}</span>
                                        </div>
                                    );
                                })
                            }
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td className="snip">
                                            <div className="result-link-bar-container">
                                                <div className="result-link-bar">
                                                    <Link className="view_resume" onClick={() =>this.downloadResume()}>download resume</Link>&nbsp;-&nbsp;
                                                    <span className="last_updated">Updated: {displayDate(entry.last_updated, 'MMM D')}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                }
            })()
			
		);
	}
}

const mapStateToProps = (state) => ({
    screenWidth: state.Environment.get('screenWidth'),
    screenHeight: state.Environment.get('screenHeight'),
});

export default connect(mapStateToProps)(Result);