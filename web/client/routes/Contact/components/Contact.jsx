import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Textfield, Button, Spinner } from 'react-mdl';
import * as contactActions from '../actions';
import { connect } from 'react-redux';
import Footer from '#app/common/components/Footer';

class Contact extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }

  clearMessage = () => {
    const { dispatch } = this.props;
    dispatch(contactActions.clearResponse());
  };

  fieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  send = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    if (this.state.message !== '' && this.state.email !== '') {
      dispatch(contactActions.sendMessage(this.state));
    }
  };

  render() {
    const { loading } = this.props;

    return (
      <section className="Contact">
          <div className="main-wrapper padding-top-40 padding-bottom-40">
            <div className="container clearfix">
              <div className="contact-container clearfix">
                <div className="grid__col--6 contact-info">
                  <div className="section-header">
                    <h2 className="heading-2">Send us a message</h2>
                    <p className="one-full">
                      The Talent Community Team
                    </p>
                    <p className="one-full">
                      <a
                        style={{color: '#09c'}}
                        target="_top"
                        href="mailto:support@talentsinafrica.com?subject=Talent Community Message"
                      >
                        support@talentsinafrica.com
                      </a> OR

                    </p>
                  </div>
                </div>
                <div className="contact-form-wrapper grid__col--6 margin-top-20 clearfix" style={{ background: '#fff' }}>
                  <div className="contact-form mdl-shadow--2dp padding-bottom-20 clearfix">
                    <form name="contact" className="clearfix" onSubmit={this.send}>
                        <div>
                          <Textfield
                            label="Name"
                            name="name"
                            floatingLabel
                            value={this.state.name}
                            required
                            onChange={this.fieldChanged}
                          />
                        </div>
                        <div>
                          <Textfield
                            label="Email"
                            name="email"
                            floatingLabel
                            value={this.state.email}
                            required
                            onChange={this.fieldChanged}
                          />
                        </div>
                        <div>
                          <Textfield
                            label="Subject"
                            name="subject"
                            value={this.state.subject}
                            floatingLabel
                            onChange={this.fieldChanged}
                          />
                        </div>
                        <div>
                          <Textfield
                            label="Message"
                            floatingLabel
                            name="message"
                            value={this.state.message}
                            rows={3}
                            required
                            onChange={this.fieldChanged}
                          />
                        </div>
                        <Button raised ripple type="submit">
                        {
                          !loading &&
                            'Send Message'
                        }
                        {
                          loading &&
                            <Spinner singleColor />
                        }
                        </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="margin-top-40"></div>
        <Footer />
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.Contact.toJSON().message,
  loading: state.Contact.toJSON().loading,
});

export default connect(mapStateToProps)(Contact);
