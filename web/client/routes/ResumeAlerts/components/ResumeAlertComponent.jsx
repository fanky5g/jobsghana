import React, { PureComponent } from 'react';
import { Textfield, Button, Spinner } from 'react-mdl';
import { Input, Select } from 'antd';
import DateInput from '#app/common/components/DateInput';
import classnames from 'classnames';
import { subscribeResumeAlert, clearPopupMessage } from '#app/common/actions/Popup';
import { connect } from 'react-redux';

const SelectOption = Select.Option;
const date = new Date();

class ResumeComponent extends PureComponent {
    state = {
      email: '',
      alertFrom: date.toISOString(),
      alertTo: date.toISOString(),
      jobTitle: '',
      location: 'greater accra',
      companyName: '',
      experience: 0,
    };

    componentWillUnmount() {
      this.props.dispatch(clearPopupMessage());
    }

    fieldChanged = (evt) => {
      if (evt.target.name === 'experience') {
        const experience = parseInt(evt.target.value, 10);

        if (experience != NaN) {
          this.setState({
            experience: evt.target.value != '' ? experience: '',
          });
        }
        return;
      }

      this.setState({
        [evt.target.name]: evt.target.value,
      });
    };

    submit = (e) => {
      e.preventDefault();
      const { dispatch } = this.props;

      if (this.props.type && this.props.type == 'modal') {
        this.props.action(dispatch, this.state);
      } else {
        this.props.dispatch(subscribeResumeAlert(this.state));
      }
    };

    onDateChange = (field, keyName, dateString) => {
      this.setState({
        [keyName]: dateString,
      });
    };

    locationChanged = (value) => {
      const { type } = this.props;
      if (type == 'modal') {
        this.setState({
          location: value.target.value,
        });

        return;
      }

      this.setState({
        location: value,
      });
    };

  render() {
    const { processing, message, requiresAction, actionComplete } = this.props;
    let { type } = this.props;

    type = type || 'component';

    let regionSelect = (
      <Select placeholder="Location" value={this.state.location ? this.state.location: undefined} onChange={this.locationChanged}>
        <SelectOption value="greater accra">Greater Accra</SelectOption>
        <SelectOption value="eastern region">Eastern Region</SelectOption>
        <SelectOption value="central region">Central Region</SelectOption>
        <SelectOption value="ashanti region">Ashanti Region</SelectOption>
        <SelectOption value="western region">Western Region</SelectOption>
        <SelectOption value="brong ahafo region">Brong Ahafo Region</SelectOption>
        <SelectOption value="upper east region">Upper East Region</SelectOption>
        <SelectOption value="upper west region">Upper West Region</SelectOption>
        <SelectOption value="volta region">Volta Region</SelectOption>
        <SelectOption value="northern region">Northern Region</SelectOption>
      </Select>
    );

    if (type == 'modal') {
      regionSelect = (
        <select placeholder="Location" value={this.state.location ? this.state.location: undefined} onChange={this.locationChanged} className="ant-select modal-select">
          <option value="greater accra">Greater Accra</option>
          <option value="eastern region">Eastern Region</option>
          <option value="central region">Central Region</option>
          <option value="ashanti region">Ashanti Region</option>
          <option value="western region">Western Region</option>
          <option value="brong ahafo region">Brong Ahafo Region</option>
          <option value="upper east region">Upper East Region</option>
          <option value="upper west region">Upper West Region</option>
          <option value="volta region">Volta Region</option>
          <option value="northern region">Northern Region</option>
        </select>
      );
    }

    return (
      <div className={classnames({Form: true, modalForm: type == 'modal'})}>
        <div className="Form__container--header">
           <h4>Get notified when a resume matches your criteria</h4>
        </div>
        <form className="ResumeAlert Form__container--step" htmlFor="ResumeAlerts" name="resume-alert" onSubmit={this.submit}>
          <div className="Form__container--fieldrow">
            <label>Email</label>
          </div>
          <div className="Form__container--fieldrow">
            <Input
                onChange={this.fieldChanged}
                name="email"
                value={this.state.email}
                required
            />
          </div>
          <div className="Form__container--fieldrow">
            <label>Company Name</label>
          </div>
          <div className="Form__container--fieldrow">
            <Input
                onChange={this.fieldChanged}
                name="companyName"
                value={this.state.companyName}
                required
            />
          </div>
          <div className="Form__container--fieldrow">
            <label>I am looking for a/an</label>
          </div>
          <div className="Form__container--fieldrow">
            <Input
                onChange={this.fieldChanged}
                name="jobTitle"
                value={this.state.jobTitle}
                required
            />
          </div>
          <div className="Form__container--fieldrow">
            <label>Residing in(Location)</label>
          </div>
          <div className="Form__container--fieldrow">
            {regionSelect}
          </div>
          <div className="Form__container--fieldrow">
            <label>Experience (in years)</label>
          </div>
          <div className="Form__container--fieldrow">
            <Input
                onChange={this.fieldChanged}
                name="experience"
                value={this.state.experience}
                required
            />
          </div>
          <div className="Form__container--fieldrow">
            <label>Notify me within this time period</label>
          </div>
          <div className="Form__container--fieldrow doubly">
            <span>
              From:&nbsp;&nbsp;
              <DateInput
               value={this.state.alertFrom}
               onEdit={this.onDateChange}
               field="alertFrom"
               keyName="alertFrom"
              />
            </span>
            <span>
              To:&nbsp;&nbsp;
              <DateInput
               value={this.state.alertTo}
               onEdit={this.onDateChange}
               field="alertTo"
               keyName="alertTo"
             />
            </span>
          </div>
          {
            (() => {
              var shouldShowButton = false;
              if (type == 'modal' && requiresAction && !actionComplete) {
                shouldShowButton = true;
              } else if(type == 'component' && !actionComplete) {
                shouldShowButton = true;
              }

              if (shouldShowButton) {
                return (
                  <div className="Form__container--fieldrow actions single">
                    <Button raised ripple type="submit" accent>
                      {
                        !processing &&
                          'Save Request'
                      }
                      {
                        processing &&
                          <Spinner singleColor />
                      }
                    </Button>
                  </div>
                );
              }
            })()
          }
          {
            !processing && actionComplete && message !== '' &&
            <div style={{textAlign: "center", marginTop: "16pt"}}>
                <span>{message}</span>
            </div>
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
   processing: state.Popup.get('processing'),
   message: state.Popup.get('message'),
   actionComplete: state.Popup.get('actionComplete'),
});

export default connect(mapStateToProps)(ResumeComponent);