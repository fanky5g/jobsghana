import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell, Spinner, Textfield, Button, Icon, IconButton } from 'react-mdl';

const Types = ({
  types,
  type,
  typeLoading,
  addActive,
  fieldChanged,
  toggleAdd,
  addType,
  deleteType,
}) => (
  <div className="Published Types">
    <div className="List__container">
      <div className="container">
        <Grid className="type-head">
          <Cell col={9}>
          {
            addActive &&
              <form onSubmit={addType}>
                <Textfield
                  label="type"
                  value={type}
                  name="type"
                  onChange={fieldChanged}
                  onBlur={toggleAdd}
                />
              </form>
          }
          </Cell>
          <Cell col={3}>
            <div className="type-actions">
              <Button onClick={toggleAdd} raised ripple>
                {
                  !typeLoading && !addActive &&
                    <Icon name="add" />
                }
                {
                  !typeLoading && addActive &&
                    <Icon name="cancel" />
                }
                {
                  typeLoading &&
                    <Spinner singleColor />
                }
              </Button>
            </div>
          </Cell>
        </Grid>
        <div>
        {
          types.length > 0 &&
            types.map(($type, index) => (
              <Grid className="type-head" key={index}>
                <Cell col={9}>
                  <span>
                    {$type.type}
                  </span>
                </Cell>
                <Cell col={3}>
                  <div className="type-actions">
                    <IconButton onClick={() => deleteType($type.ID)} name="delete" />
                  </div>
                </Cell>
              </Grid>
            )
          )
        }
        {
          types.length === 0 &&
            <div style={{ display: 'block', textAlign: 'center' }}>
              <span>No types created</span>
            </div>
        }
        </div>
      </div>
    </div>
  </div>
);

Types.propTypes = {
  types: PropTypes.array,
  type: PropTypes.string,
  typeLoading: PropTypes.bool,
  addActive: PropTypes.bool,
  fieldChanged: PropTypes.func,
  toggleAdd: PropTypes.func,
  addType: PropTypes.func,
  deleteType: PropTypes.func,
};

export default Types;
