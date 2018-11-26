import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import Dash from '#app/containers/Dash';
import NotFound from '#app/routes/not-found';
import Overview from '#app/routes/overview';
import Unauthorized from '#app/routes/unauthorized/components/unauthorized';
import Login from '#app/routes/adminLogin/components/Login';
import requireAuthentication from '#app/common/components/AuthenticatedComponent';
import Accounts from '#app/routes/accounts';
import Post from '#app/routes/Post/components/Post';
import Posts from '#app/routes/Posts/components/Posts';
import Message from '#app/routes/Message/components/Message';
import Messages from '#app/routes/Messages/components/Messages';
import Editor from '#app/routes/Post/children/Editor/components/Editor';
import Images from '#app/routes/Post/children/Images/components/Images';
import Preview from '#app/routes/Post/children/Preview/components/Preview';
import Settings from '#app/routes/Post/children/Settings/components/Settings';
import AllPosts from '#app/routes/Posts/children/AllPosts/components/AllPosts';
import Categories from '#app/routes/Posts/children/Categories/components/Types';
import Drafts from '#app/routes/Posts/children/Drafts/components/Drafts';
import Published from '#app/routes/Posts/children/Published/components/Published';
import PreviewResume from '#app/routes/preview-resume';
import NewsletterSubscribers from '#app/routes/Subscribers/children/Newsletter';
import JobAlertSubscribers from '#app/routes/Subscribers/children/JobAlerts';
import ResumeAlertSubscribers from '#app/routes/Subscribers/children/ResumeAlerts';
import ReviewAlertSubscribers from '#app/routes/Subscribers/children/ReviewAlerts';
import Subscribers from '#app/routes/Subscribers/components/Subscribers';


export default ({ store }) => {
  return (
    <Route>
      <Route path="/" component={requireAuthentication(Dash, ['superadmin', 'admin'], true)}>
        <IndexRoute component={Overview} name="Overview" />
        <Route path="accounts" component={Accounts} name="Accounts" />
        <Route path="post" component={Post} name="Post">
          <IndexRoute component={Editor} name="Editor" />
          <Route path="images" component={Images} name="Images" />
          <Route path="preview" component={Preview} name="Preview" />
          <Route path="settings" component={Settings} name="Settings" />
        </Route>
        <Route path="posts" component={Posts} name="Posts">
          <Route path="all" component={AllPosts} name="All" />
          <Route path="categories" component={Categories} name="Categories" />
          <Route path="drafts" component={Drafts} name="Drafts" />
          <Route path="published" component={Published} name="Published" />
        </Route>
        <Route path="subscribers" component={Subscribers} name="Subscribers">
          <Route path="newsletter" component={NewsletterSubscribers} name="Newsletter Subscribers" />
          <Route path="job_alerts" component={JobAlertSubscribers} name="Job Alerts" />
          <Route path="view_alerts" component={ReviewAlertSubscribers} name="Review Alerts" />
          <Route path="resume_alerts" component={ResumeAlertSubscribers} name="Resume Alerts" />
        </Route>
        <Route path="message" component={Message} name="Message" />
        <Route path="messages" component={Messages} name="Messages" />
      </Route>
      <Route path="resume-preview" name="Resume Preview" component={PreviewResume} />
      <Route path="login" component={Login} />
      <Route path="unauthorized" name="Restricted Access" component={Unauthorized} />
      <Route path="*" component={NotFound} name="Page Not Found"/>
    </Route>
  );
};
