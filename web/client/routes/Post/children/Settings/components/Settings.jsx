import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Textfield, Button } from 'react-mdl';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Select from 'react-select';

export default class Settings extends PureComponent {
  static propTypes = {
    router: PropTypes.object,
    headerImage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    files: PropTypes.array,
    date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.object]),
    editMode: PropTypes.bool,
    fieldChanged: PropTypes.func,
    readNext: PropTypes.string,
    tags: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    title: PropTypes.string,
    type: PropTypes.object,
    types: PropTypes.array,
    ip_owner: PropTypes.string,
    typeSelected: PropTypes.func,
    abstract: PropTypes.string,
    handleDateChange: PropTypes.func,
    goToUrl: PropTypes.func,
  };

  getHeader = (header) => {
    const { editMode } = this.props;
    if (header && typeof header === 'object' && !header.hasOwnProperty('key')) {
      return header.name;
    } else if (header && typeof header === 'object' && header.hasOwnProperty('key')) {
      return header.key;
    }
    return 'Not set';
  };

  selectHeaderImage = (path) => {
    const { goToUrl } = this.props;
    goToUrl(path, { ref: 'header' });
  };

  render() {
    const { headerImage, files, date, types, type, typeSelected } = this.props;
    let header;
    if (files.length > 0) {
      header = files[headerImage];
    }

    const adjustedDate = moment(date, 'ddd MMM DD HH:mm:ss YYYY');
    const typeOptions = types.map($type => ({ label: $type.type, value: $type.type }));

    return (
      <div className="PostSettings">
        <div className="PostSettings__section">
          <h3>Title</h3>
          <div className="PostSettings__text">
            <Textfield
              label="Title..."
              value={this.props.title}
              style={{ width: '100%' }}
              onChange={this.props.fieldChanged}
              name="title"
            />
          </div>
        </div>
        <div className="PostSettings__section">
          <h3>Author</h3>
          <div className="PostSettings__text">
            <Textfield
              label="Written By..."
              value={this.props.ip_owner}
              style={{ width: '100%' }}
              onChange={this.props.fieldChanged}
              name="ip_owner"
            />
          </div>
        </div>
        <div className="PostSettings__section">
          <h3>Type</h3>
          <div className="list_select">
            <Select
              name="filter-brand"
              options={typeOptions}
              value={type.value}
              placeholder="Select type"
              className="select-type"
              onChange={typeSelected}
            />
          </div>
        </div>
        <div className="PostSettings__section">
          <h3>Abstract</h3>
          <div className="PostSettings__abstract PostSettings__text">
            <Textfield
              label="post abstract(summary)"
              rows={5}
              value={this.props.abstract}
              style={{ width: '100%' }}
              onChange={this.props.fieldChanged}
              name="abstract"
            />
          </div>
        </div>
        <div className="PostSettings__section date">
          <h3>Date</h3>
          <DatePicker
            selected={adjustedDate}
            todayButton={'Vandaag'}
            className="date-picker"
            onChange={this.props.handleDateChange}
            showYearDropdown
            placeholderText="Set Date"
          />
        </div>
        <div className="PostSettings__section">
          <h3>Header Image</h3>
          <div style={{ padding: '20px 0' }} className="clearfix">
            <Button
              raised
              ripple
              style={{ marginRight: '10px' }}
              onClick={() => this.selectHeaderImage('/post/images')}
              className="image-btn"
            >
              Select
            </Button>
            <span className="image-title">
            {this.getHeader(header)}
            </span>
          </div>
        </div>
        <div className="PostSettings__section">
          <h3>Tags</h3>
          <div className="PostSettings__text">
            <Textfield
              label="Tags..."
              style={{ width: '100%' }}
              value={this.props.tags}
              onChange={this.props.fieldChanged}
              name="tags"
            />
          </div>
        </div>
        <div className="PostSettings__section">
          <h3>Read Next</h3>
          <div className="PostSettings__text">
            <Textfield
              label="read next..."
              value={this.props.readNext}
              style={{ width: '100%' }}
              onChange={this.props.fieldChanged}
              name="readNext"
            />
          </div>
        </div>
      </div>
    );
  }
}
