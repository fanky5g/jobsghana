import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FABButton, Icon, Spinner } from 'react-mdl';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import * as postsActions from '#app/common/actions/Posts';
import Confirm from '#app/common/components/Confirm';
import TabsComponent from '#app/common/components/Tabs';
import classnames from 'classnames';

class Posts extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired,
    isWaiting: PropTypes.bool,
    children: PropTypes.object,
    types: PropTypes.array,
    typesLoading: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      type: '',
      addActive: false,
    };
  }

  clearMessage = () => {
    const { dispatch } = this.props;
    dispatch(postsActions.resetMessages());
  };

  postClicked = (pid) => {
    const { router } = this.context;
    router.push(`/post?action=edit&pid=${pid}`);
  };

  addPost = () => {
    const { router } = this.context;
    router.push('/post');
  };

  deleteType = (id) => {
    const { dispatch } = this.props;
    const wrapper = document.body.appendChild(document.createElement('div'));

    function cleanup() {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => wrapper.remove());
    }

    const modalComponent = ReactDOM.render(
      <Confirm
        description="Deleting a post type will delete all associated posts, Confirm to continue action."
        title="Delete Category?"
        cancelAction={() => {}}
        action={() => dispatch(postsActions.deleteType(id))}
        isOpen
        />,
      wrapper);

    modalComponent.$promise.promise.finally(cleanup.bind(null, wrapper));
      modalComponent.$promise
        .promise
        .then((response) => {
          resolve(response);
        })
        .catch((response) => {
          reject();
        });
  };

  addType = (evt) => {
    evt.preventDefault();
    const { dispatch } = this.props;
    dispatch(postsActions.addType(this.state.type));
  };

  toggleAdd = () => {
    this.setState({
      addActive: !this.state.addActive,
    });
  };

  fieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  render() {
    const { posts, isWaiting, typesLoading, types, location } = this.props;
    const { addActive, type } = this.state;

    return (
      <div className={classnames({Posts: true, "mdl-shadow--3dp": !isWaiting, loading: isWaiting})}>
        <FABButton colored raised className="Posts__add" onClick={this.addPost}>
          <Icon name="add" />
        </FABButton>
        {
          isWaiting &&
          <div style={{margin: '20px 40%'}}>
            <Spinner singleColor />
          </div>
        }
        {
          !isWaiting &&
            this.props.children && React.cloneElement(this.props.children, {
              posts,
              typesLoading,
              types,
              type,
              addActive,
              onPostClick: this.postClicked,
              fieldChanged: this.fieldChanged,
              toggleAdd: this.toggleAdd,
              addType: this.addType,
              deleteType: this.deleteType,
            })
        }
        <section>
        </section>
      </div>
    );
  }
}

const hooks = {
  defer: ({ dispatch, store: { getState } }) => {
    const postsLoaded = getState().Posts.toJSON().loaded;
    const postsLoading = getState().Posts.toJSON().isWaiting;

    if (!postsLoaded && !postsLoading) return Promise.resolve(dispatch(postsActions.getPosts()));
    return Promise.resolve();
  },
};

const mapStateToProps = (state) => ({
  posts: state.Posts.toJSON().data,
  isWaiting: state.Posts.toJSON().isWaiting,
  message: state.Posts.toJSON().message,
  typesLoading: state.Posts.toJSON().typesLoading,
  types: state.Posts.toJSON().types,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Posts));
