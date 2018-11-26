import React, { PureComponent } from 'react';
import Link from 'react-router/lib/Link';
import { getPrivacy } from '#app/common/actions/App';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import Footer from '#app/common/components/Footer';

class Privacy extends PureComponent {
  render() {
    const { privacy } = this.props;
  
    return (
      <div className="terms-container Content">
        <div className="privacy-policy grid margin-bottom-20">
          <div className="container padding-top-20">
            {
              privacy.length > 0 &&
              <ReactMarkdown source={privacy} className="markdown-body" />
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const getData = ({dispatch, store: {getState}}) => {
    const loaded = getState().App.get('privacy') !== '';
    if (!loaded) {
      return Promise.resolve(dispatch(getPrivacy()));
    }

    return Promise.resolve();
};

const hooks = {
  defer: getData,
  fetch: getData,
};

const mapStateToProps = (state) => ({
  privacy: state.App.get('privacy'),
});

export default provideHooks(hooks)(connect(mapStateToProps)(Privacy));