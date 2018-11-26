import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Spinner, Header, HeaderRow } from 'react-mdl';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { contentStateToMarkdown } from '#app/util/common';
import { notification } from 'antd';
import moment from 'moment';

import {
  createPost,
  editPost,
  delPost,
  publishPost,
  unpublishPost,
} from '../actions';
import { resetMessages, getPosts } from '#app/common/actions/Posts';
import { slugify, parseImageUrl } from '#app/lib/util';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { provideHooks } from 'redial';
import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';

class PostIndex extends PureComponent {
  static propTypes = {
    posts: PropTypes.array,
    post: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    children: PropTypes.object,
    types: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const { location: { query } } = props;
    this.editMode = Object.hasOwnProperty.call(query, 'action') && query.action === 'edit';

    this.state = {
      editMode: this.editMode,
      inited: false,
      content: EditorState.createEmpty(),
      insertedImage: {},
      files: [],
      attached: [],
      title: '',
      tags: '',
      readNext: '',
      ip_owner: '',
      type: {},
      abstract: '',
      date: moment().format('ddd MMM DD HH:mm:ss YYYY'),
      validation: {
        isValid: true,
        validationMessage: '',
      },
      firstLoad: true,
    };

    this.currentState = this.state;
    this.inited = false;
  }

  componentWillReceiveProps(nextProps) {
    const { post } = nextProps;
    if (nextProps.message) {
      if (nextProps.message === 'post created' ||
        nextProps.message === 'Delete successful') {
        setTimeout(this.clearMessage, 5000);
        this.goToUrl.call(this, '/posts');
      } else {
        setTimeout(this.clearMessage, 5000);
      }
    }
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    if (this.editMode && !this.state.inited) {
      this.updateState(this.props.post);
    }

    if (this.state.validation.validationMessage !== '') {
      notification.error({message: this.state.validation.validationMessage});
      setTimeout(this.setValid, 5000);
    }
  }

  setValid = () => {
    this.setState({
      validation: {
        isValid: true,
        validationMessage: '',
      },
    });
  };

  updateState = (post) => {
    if (!this.state.inited && this.editMode && post) {
      this.setState(
        Object.assign(...this.state, post, {
          attached: post.images,
          headerImage: post.headerImageIndex,
          files: post.images,
          type: { label: post.type, value: post.type },
          tags: post.tags ? Array.isArray(post.tags) ? post.tags.join(' ') : post.tags: '',
          inited: true,
          content: EditorState.createWithContent(stateFromMarkdown(post.content)),
          readNext: post.readNext.join(' '),
        })
      );
    }
  };

  transformState = (state) => {
    let copy = {};
    Object.keys(state).forEach(key => {
      if (key != 'content') {
        copy[key] = _.cloneDeep(state[key]);
      }

      if (key == 'content') {
        copy.content = contentStateToMarkdown(state.content);
      }
    });

    return copy;
  };

  savePost = () => {
    const { dispatch } = this.props;
    // create copies, dont touch actual state
    const stateCopy = this.transformState(this.state);
    const currentStateCopy = this.transformState(this.currentState);

    if (!this.checkChanged(stateCopy, currentStateCopy)) return;
    const formData = new FormData();
    let passed = true;

    this.validate().then(() => {
      Object.keys(stateCopy).forEach((key) => {
        if (key === 'date') {
          return formData.append('date', stateCopy.date);
        }

        if (key === 'attached') {
          if (this.editMode) {
            const attached = stateCopy.attached.map(attachment => {
              if (attachment.hasOwnProperty('key')) return attachment;
              return {fileName: attachment.name};
            });

            formData.append('attached', JSON.stringify(attached));

            const newAttachments = stateCopy.attached.filter(
              attachment => !attachment.hasOwnProperty('key')
            );

            return newAttachments.forEach((file) => formData.append(file.name, file));
          }
          return stateCopy.attached.forEach(file => formData.append(file.name, file));
        } else if (key === 'headerImage') {
          let toAttach;
          if (Array.isArray(stateCopy.headerImage)) {
            toAttach = stateCopy.headerImage[0];
          } else if (typeof stateCopy.headerImage === 'string') {
            toAttach = stateCopy.headerImage;
          } else {
            toAttach = stateCopy.headerImage;
          }
          return formData.append('headerImage', toAttach);
        } else if (!((_.isArray(stateCopy[key]) && _.isArray(stateCopy[key])) ||
            (_.isObject(stateCopy[key]) && _.isObject(stateCopy[key])))) {
          if (!(stateCopy[key] !== currentStateCopy[key])) {
            return false;
          }
        } else {
          if (!this.checkChanged(stateCopy[key], currentStateCopy[key])) {
            return false;
          }
        }

        if (key === 'content') {
          const queryString = '![attachment-';
          let pos = stateCopy.content.indexOf(queryString);
          let attachmentIndex = 0;
          let attachmentsPassed = true;

          while (pos !== -1) {
            attachmentIndex = parseInt(stateCopy.content[pos + queryString.length], 10);
            if (
              stateCopy.attached[attachmentIndex] === null ||
              stateCopy.attached[attachmentIndex] === undefined) {
              attachmentsPassed = false;
            }
            pos = stateCopy.content.indexOf('![attachment-', pos + 1);
          }

          if (!attachmentsPassed) {
            notification.error({message: `one of attachments not found in post images,
              crosscheck to remove attachments you might have deleted from the images tab`});
            passed = false;
            return passed;
          }
        }

        if (key === 'type') {
          return formData.append('type', stateCopy.type.value);
        }

        if (key === 'shorturl') {
          return formData.append('shorturl', stateCopy.shorturl);
        }

        if (key === 'title') {
          if (!this.editMode) {
            formData.append('title', stateCopy.title);
            return formData.append('shorturl', slugify(stateCopy[key]));
          }
          return formData.append('title', stateCopy.title);
        }

        if (key === 'ip_owner') {
          return formData.append('ip_owner', stateCopy.ip_owner);
        }

        if (key == 'content') {
          return formData.append(key, stateCopy.content);
        }

        if (!this.editMode) {
          return formData.append(key, stateCopy[key]);
        }
        
        // editmode, skip attaching files
        if (key !== 'files') {
          if (typeof stateCopy[key] == 'object') {
            return formData.append(key, JSON.stringify(stateCopy[key]));
          }
          return formData.append(key, stateCopy[key]);
        }
      });

      if (passed) {
        if (this.editMode) {
          formData.append('headerImageIndex', stateCopy.headerImageIndex);
          return dispatch(editPost(formData));
        }
        return dispatch(createPost(formData));
      }
      return false;
    }, (err) => {
      this.setState({
        validation: {
          isValid: false,
          validationMessage: err,
        },
      });
    });
  };

  validate = () => {
    const requiredFields = [
      'title',
      'ip_owner',
      'type',
      'content',
      'abstract',
      'headerImage',
    ];

    return new Promise((resolve, reject) => {
     const fieldPasses = (field) => {
      if (field == 'headerImage') {
        return typeof this.state.headerImage != 'undefined';
      }

      if (!this.state[field]) {
          return false;
        }

        if (field === 'content' && contentStateToMarkdown(this.state.content) === '') {
          return false;
        }

        if (Array.isArray(this.state[field]) && !this.state[field].length) {
          return false;
        }

        if (typeof this.state[field] === 'object' && !Object.keys(this.state[field]).length) {
          return false;
        }

        return true;
     };

     requiredFields.forEach(field => {
        if (!fieldPasses(field)) {
          reject(`${field} is required`);
        }
     });

      resolve(true);
    });
  };

  addHeaderImage = (index) => {
    const { attached, files } = this.state;
    const attachedIndex = attached.findIndex((item) => item.name === files[index].name);

    if (attachedIndex !== -1) {
      // image already exists in attached object..assign index to header image
      this.setState({
        headerImage: attachedIndex,
      });
    } else {
      this.setState({
        headerImage: attached.length,
        attached: [...attached, files[index]],
      });
    }
  };


  fieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  addImages = (files) => {
    const filtered = files.filter((file) => {
      const found = this.state.files.findIndex(item => item.name === file.name);
      return found === -1;
    });

    this.setState({
      files: this.state.files.concat(filtered),
    });
  };

  removeImage = (index) => {
    // fix this
    this.setState({
      files: [...this.state.files.slice(index, 1),
        ...this.state.files.slice(index + 1),
      ],
    });
  };

  dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    // let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: 'image/png' });
  };

  checkChanged(val1, val2) {
    _.mixin({
      deepEquals: (ar1, ar2) => {
        let stillMatches;
        if (!((_.isArray(ar1) && _.isArray(ar2)) || (_.isObject(ar1) && _.isObject(ar2)))) {
          return false;
        }
        if (ar1.length !== ar2.length) {
          return false;
        }
        stillMatches = true;
        const fail = () => {
          stillMatches = false;
        };
        _.each(ar1, (prop1, n) => {
          const prop2 = ar2[n];

          if (prop1 !== prop2 && (n !== 'editMode' && n !== 'validation') &&
            !_.deepEquals(prop1, prop2)) {
            fail();
          }
        });
        return stillMatches;
      },
    });

    return !_.deepEquals(val1, val2);
  }

  goToUrl = (path, queries = {}) => {
    const { location } = this.props;
    const { query } = location;
    let $query = Object.assign(query, queries);

    if (path.includes('images') &&
      $query.hasOwnProperty('ref') &&
      !location.pathname.includes('settings')) {
      delete $query.ref;
    }

    const { router } = this.context;
    const cursorPos = this.state.cursorPos || 0;
    if (path === location.pathname) return;
    if (path === '/post/images' && location.pathname === '/post') {
      $query.iat = cursorPos;
    }

    router.push({
      pathname: path,
      query: $query,
    });
  };

  contentChanged = (editorState) => this.setState({
    content: editorState,
    insertedImage: {},
  });

  disableFirstLoad = () => this.setState({
    firstLoad: false,
  });

  insertImage = (index) => {
    const { attached, files } = this.state;
    let image = files[index];
    const attachedIndex = attached.findIndex((item) => item.name === files[index].name);
    let $attached;
    let $attachedIndex;

    if (attachedIndex !== -1) {
      // image already exists in attached...dont reinsert
      $attached = attached;
      $attachedIndex = attachedIndex;
    } else {
      $attached = [...attached, image];
      $attachedIndex = attached.length;
    }

    let imageData = {};
    if (this.editMode && !image.hasOwnProperty('preview')) {
      image = {
        preview: parseImageUrl({
          ...image,
          width: 200,
          strategy: 'resample',
        }),
      };
      window.URL = window.URL || window.webkitURL;
      imageData.src = `${image.preview ?
        `${image.preview}` :
        window.URL.createObjectURL(
          this.dataURItoBlob(`data:image/png;base64,${image}`)
        )}`;
      imageData.alt = `attachment-${$attachedIndex}`;

    } else {
      imageData.src = image.preview;
      imageData.alt = `attachment-${$attachedIndex}`;
    }

    this.setState({
      insertedImage: imageData,
      attached: $attached,
    });
  };

  clearMessage = () => {
    const { dispatch } = this.props;
    dispatch(resetMessages());
  };

  closeNotification = () => this.setState({
    validation: {
      isValid: true,
      validationMessage: '',
    },
  });

  deletePost = (shorturl) => {
    const { dispatch } = this.props;
    dispatch(delPost(shorturl));
  };

  handleDateChange = (date) => {
    this.setState({
      date: moment(date).format('ddd MMM DD HH:mm:ss YYYY'),
    });
  };

  typeSelected = (type) => {
    this.setState({
      type,
    });
  };

  render() {
    // add delete button
    const { insertedImage, type } = this.state;
    const { dispatch, loading, types, post } = this.props;
    const $publishPost = bindActionCreators(publishPost, dispatch);
    const $unpublishPost = bindActionCreators(unpublishPost, dispatch);

    return (
      <div className="EditorContainer">
        <Header className="EditorContainer__Header">
          <HeaderRow title={
            <div>
            {
              post &&
                <Button
                  onClick={
                    post.published ? () => $unpublishPost(post.shorturl) :
                    () => $publishPost(post.shorturl)
                  }
                  raised
                  ripple
                  style={{ textTransform: 'capitalize' }}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </Button>
            }
            {
              post &&
                <Button
                  onClick={() => this.deletePost(post.shorturl)}
                  raised
                  ripple
                  style={{ textTransform: 'capitalize' }}
                >
                  Delete
                </Button>
            }
              <Button
                onClick={() => this.goToUrl('/post')}
                raised
                ripple
                style={{ textTransform: 'capitalize' }}
              >
                Editor
              </Button>

              <Button
                onClick={() => this.goToUrl('/post/preview')}
                raised
                ripple
                style={{ textTransform: 'capitalize' }}
              >
                Preview
              </Button>
            </div>
          } key={1}>
              <div className="EditorContainer__Header-actions">
                <IconButton name="image" onClick={() => this.goToUrl('/post/images')} />
                <IconButton name="settings" onClick={() => this.goToUrl('/post/settings')} />
                <IconButton name="save" onClick={this.savePost} />
                {
                  loading &&
                    <Spinner
                      singleColor
                      style={{ width: '24px', height: '24px', display: 'inline-block', top: '5px' }}
                    />
                }
            </div>
          </HeaderRow>
        </Header>
        <div className="Editor__Main">
        {
          this.props.children && React.cloneElement(this.props.children, {
            ...this.state,
            insertedImage,
            type,
            types,
            typeSelected: this.typeSelected,
            contentChanged: this.contentChanged,
            published: this.published,
            addImages: this.addImages,
            insertImage: this.insertImage,
            addHeaderImage: this.addHeaderImage,
            fieldChanged: this.fieldChanged,
            router: this.context.router,
            editMode: this.editMode,
            firstLoad: this.state.firstLoad,
            doneFirstLoad: this.disableFirstLoad,
            handleDateChange: this.handleDateChange,
            goToUrl: this.goToUrl,
            placeholder: 'Share something...',
          })
        }
        </div>
      </div>
    );
  }
}

const hooks = {
  defer: ({ dispatch, store: { getState } }) => {
    const { loaded } = getState().Posts.toJSON();

    if (!loaded) {
      return Promise.resolve(dispatch(getPosts()));
    }
    return Promise.resolve();
  },
};

const mapStateToProps = (state, ownProps) => ({
  postSuccess: state.Posts.get('postSuccess'),
  posts: state.Posts.toJSON().data,
  post: state.Posts.toJSON().data.find(post => post.ID === parseInt(ownProps.location.query.pid, 10)),
  types: state.Posts.toJSON().types,
  loading: state.Posts.get('isWaiting'),
  message: state.Posts.get('message'),
});

export default provideHooks(hooks)(connect(mapStateToProps)(PostIndex));
