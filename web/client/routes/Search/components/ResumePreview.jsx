import React from 'react';
import Basics from '#app/routes/preview-resume/components/Basics';
import Work from '#app/routes/preview-resume/components/Work';
import Education from '#app/routes/preview-resume/components/Education';
import Skills from '#app/routes/preview-resume/components/Skills';

const highlight = (string, highlightOn) => {

};

export const Preview = ({resume, last_updated, uid, formatDate}) => (
  <div className="view">
    <div className="preview_top">
      <span className="preview_last_updated">Updated: {last_updated}</span>
      <a className="view_link preview_full_resume_link" href={`/preview?uid=${uid}`} target="_blank" rel="nofollow">View Full Resume</a>
    </div>
    <div className="resume_content">
      <h1 className="preview_header">
        <span className="preview_name ">
          {resume.jobTitle.split(' ').map((s, i) => <span key={i} className="hl">{s}&nbsp;</span>)}
        </span>
        <span className="preview_city"> - {resume.location}</span>
      </h1>
      <h2 className="preview_title">Summary</h2>
      <div className="preview_item">
        <p className="statement">{resume.personalStatement}</p>
      </div>
      <h2 className="preview_title preview_wetitle">Work Experience</h2>
      {
        Array.isArray(resume.workExperience) &&
        resume.workExperience.map((work, index) => (
          <div className="preview_item" key={index}>
            <h3 className="workexp_title">
              {work.role.split(' ').map((s, i) => <span key={i} className="hl">{s}&nbsp;</span>)}
              <span className="work_dates"> - {formatDate(work.start, 'YYYY')} to {formatDate(work.end, 'YYYY')}</span>
            </h3>
            <p>
              <span className="workexp_company">
                {work.company}
              </span>
            </p>
            <p className="preview_description" dangerouslySetInnerHTML={{__html: work.roles}}></p>
          </div>
        ))
      }
      <h2 className="preview_title preview_edutitle">Education</h2>
      {
        Array.isArray(resume.education) &&
        resume.education.map((school, index) => (
          <div className="preview_item" key={index}>
            <h3 className="edu_title">{school.qualification}<span className="edu_date"> - {formatDate(school.completed, 'YYYY')}</span></h3>
            <p>
              <span className="edu_school">{school.institution}</span>
            </p>
          </div>
        ))
      }
      <h2 className="preview_title">Skills</h2>
      <div className="preview_item">
        <p>
          {
            Array.isArray(resume.skills) &&
            resume.skills.map((skill, index) => (
              <span className="skill-text" key={index}>{skill}{(index != resume.skills.length - 1 ? ',': '')}</span>
            ))
          }
        </p>
      </div>
      </div>
    <div className="preview_bg"></div>
  </div>
);