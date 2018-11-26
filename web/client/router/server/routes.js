import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from '#app/containers/App';
import ResumeSearch from '#app/routes/find-resume';
import JobSearch from '#app/routes/find-job';
import Home from '#app/routes/Home';
import NotFound from '#app/routes/not-found';
import Login from '#app/routes/Login/components/Login';
import Unauthorized from '#app/routes/unauthorized/components/unauthorized';
import PrivacyPolicy from '#app/routes/privacy-policy/components/PrivacyPolicy';
import Resume from '#app/routes/resume';
import Preview from '#app/routes/preview-resume';
import Join from '#app/routes/join';
import JoinSuccess from '#app/routes/join-success';
import Welcome from '#app/routes/join-success';
import Me from '#app/routes/me';
import requireAuthentication from '#app/common/components/AuthenticatedComponent';
import About from '#app/routes/About/components/About';
import ResumeAlerts from '#app/routes/ResumeAlerts/components/ResumeAlerts';
import Search from '#app/routes/Search/components/Search';
import Blog from '#app/routes/Blog';
import BlogPost from '#app/routes/Blog/children/Single/components/Single';
import Contact from '#app/routes/Contact/components/Contact';


export default ({ store }) => {
  return (
    <Route>
      <Route path="/" component={App}>
        <IndexRoute component={Home}  name="Home" />
        <Route path="about" name="About Us" component={About} />
        <Route path="find-resume" name="Find Resume" component={ResumeSearch} />
        <Route path="find-job" name="Find Job" component={JobSearch} />
        <Route path="login" name="Login" component={Login} />
        <Route path="preview" name="Resume Preview" component={Preview} />
        <Route path="resume" name="Profile" component={Resume} />
        <Route path="join" name="Create Account" component={Join} />
        <Route path="welcome" name="Welcome" component={JoinSuccess} />
        <Route path="welcome" name="Welcome" component={Welcome} />
        <Route path="cv-alert" name="CV Alert" component={ResumeAlerts} />
        <Route path="search" name="Search Results" component={Search} />
        <Route path="career-advice" name="Career Advice" component={Blog} />
        <Route path="career-advice/:shorturl" name="Post" component={BlogPost} />
        <Route path="contact" name="Contact Us" component={Contact} />
        <Route path="me" name="My Profile" component={requireAuthentication(Me, ['admin', 'superadmin', 'user'], true)} />
        <Route path="privacy-policy" name="Privacy Policy" component={PrivacyPolicy} />
      </Route>
      <Route component={App}>
        <Route path="unauthorized" name="Restricted Access" component={Unauthorized} />
        <Route path="*" component={NotFound} name="Page Not Found"/>
      </Route>
    </Route>
  );
};