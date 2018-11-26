import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import { IconButton } from 'react-mdl';
import { getSrc, parseImageUrl } from '#app/lib/util';

export default class Images extends PureComponent {
  static propTypes = {
    addImages: PropTypes.func,
    router: PropTypes.object,
    location: PropTypes.object,
    insertImage: PropTypes.func,
    addHeaderImage: PropTypes.func,
    files: PropTypes.array,
    editMode: PropTypes.bool,
    goToUrl: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  onDrop = (files) => this.props.addImages(files);

  imageChecked = (index) => {
    const { goToUrl, location } = this.props;
    const insertAt = location.query.iat;
    const headerRef = location.query.ref;

    if (!(insertAt || headerRef)) return;

    if (parseInt(insertAt, 10) >= 0 && !headerRef) {
      goToUrl('/post');
      this.props.insertImage(index);
    } else {
      goToUrl('/post/settings');
      this.props.addHeaderImage(index);
    }
  };

  showImageCheck = () => {
    const { location } = this.props;
    const refHeader = typeof location.query.ref != 'undefined' && location.query.ref === 'header';
    const refEditor = typeof location.query.iat != 'undefined';
    return refHeader || refEditor;
  };

  render() {
    const { files } = this.props;
    const showImageCheck = this.showImageCheck();
    // @todo::add delete image button
    return (
      <div className="PostImages">
        <DropZone onDrop={this.onDrop} className="DropZone" accept="image/*">
          <div>Try dropping some files here, or click to select files to upload...</div>
        </DropZone>
        <div className="grid">
        {
          files.length > 0 ?
            (<div>
              <h3 className="PostImages__header">Attached Images</h3>
              <div className="attached">
              {
                files.map((file, index) => {
                  let src;
                  if (typeof file === 'object' && Object.hasOwnProperty.call(file, 'key')) {
                    src = parseImageUrl({
                      ...file,
                      width: 100,
                      strategy: 'resample',
                      quality: 20,
                    });
                  } else {
                    src = file.preview !== undefined ? file.preview : file;
                  }
                  return (
                    <div className={`attached-item-${index} mdl-shadow--2dp`} key={index}>
                        {
                          showImageCheck &&
                          <IconButton
                            name="insert_photo"
                            onClick={() => this.imageChecked(index)}
                            className="Image_check"
                          />
                        }
                      <img src={src} alt="list item" />
                    </div>
                  );
                })
              }
              </div>
            </div>) : null
        }
        </div>
      </div>
    );
  }
}
