import React from 'react';
import PropTypes from 'prop-types';
import Profile from './components/Profile';
import Preferences from './components/Preferences';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Competencies from './components/Competencies';
import Skills from './components/Skills';
import Awards from './components/Awards';
import Certifications from './components/Certifications';
import Referees from './components/Referees';
import FilesAndOptions from './components/FilesAndOptions';

const steps = [
  {name: 'Basic Information', component: Profile},
  {name: 'Preferences', component: Preferences},
  {name: 'Work Experience', component: WorkExperience},
  {name: 'Education', component: Education},
  {name: 'Competencies', component: Competencies},
  {name: 'Skills', component: Skills},
  {name: 'Awards', component: Awards},
  {name: 'Certifications', component: Certifications},
  {name: 'Referees', component: Referees},
  {name: 'Complete Account', component: FilesAndOptions},
];

export default steps;