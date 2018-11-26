import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { initResume, enableSection, disableSection, addSubField, removeFieldAt, editFieldAt } from './actions';
import clone from 'lodash/cloneDeep';
import classnames from 'classnames';

export default class Multistep extends PureComponent {
  componentDidMount() {
    if (this.props.incomplete) {
      alert('please complete your resume');
    }
  }

  addField = (sectionName) => {
    const { dispatch } = this.props;
    dispatch(addSubField(sectionName));
  };

  removeSubField = (field, index) => {
    const { dispatch } = this.props;
    dispatch(removeFieldAt(field, index));
  };

  onEdit = (field, key, value, index) => {
    const { dispatch } = this.props;
    dispatch(editFieldAt(field, key, value, index));
  };

  render() {
    const { step, isMobile } = this.props;
    if (this.props.steps.length == step) {
      return null;
    }

    const stepComponent = React.createFactory(this.props.steps[step].component);
    
    return (
      <div className={classnames({"page-content": !isMobile, "content-wrapper": !isMobile})}>
        {
          stepComponent({
            resume: this.props.resume,
            addField: this.addField,
            removeSubField: this.removeSubField,
            onEdit: this.onEdit,
            ...this.props,
          })
        }
      </div>
    );
  }
}
