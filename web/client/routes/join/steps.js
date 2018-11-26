import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import StepOne from './components/stepOne';
import StepTwo from './components/stepTwo';

const steps = 
    [
      {name: 'Newsletter/Updates', component: StepOne},
      {name: 'Credentials', component: StepTwo},
    ];

export default steps;