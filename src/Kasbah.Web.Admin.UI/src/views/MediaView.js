import React from 'react';

// TODO: this is all hacked together and is currently only meant
// as a prototype

export default class extends React.Component {
    constructor () {
      super();

      this.state = {};
    }

    _renderUploadModal () {
        // TODO: hook this up properly...
      return (
            <div>
                <div className='modal-backdrop in' />
                <div className='modal' style={{'display': 'block'}}>
                    <div className='modal-dialog' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={this.handleHideMediaUpload.bind(this)}>
                                    <span aria-hidden='true'>&times;</span>
                                    <span className='sr-only'>Close</span>
                                </button>
                                <h4 className='modal-title'>Media Upload</h4>
                            </div>
                            <div className='modal-body'>
                                <form>
                                    <fieldset className='form-group'>
                                        <input type='file' className='form-control-file' ref='file' />
                                    </fieldset>
                                </form>
                                <p>Show some details about the file to be uploaded, size, type, etc...</p>
                                <p>Something for later... give implement a media editing tool (image cropper, etc...)</p>
                                <p>Also allow for multiple file uploads</p>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-sm btn-secondary' data-dismiss='modal' onClick={this.handleHideMediaUpload.bind(this)}>Cancel</button>
                                <button type='button' className='btn btn-primary' onClick={this.handleHideMediaUpload.bind(this)}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleShowMediaUpload () {
      this.setState({ showMediaUpload: true });
        // HACK!
      document.body.className += 'modal-open';
    }

    handleHideMediaUpload () {
      this.setState({ showMediaUpload: false });
        // HACK!
      document.body.className = document.body.className.replace('modal-open', '');
    }

    render () {
      return (
            <div className='container page-content'>
                <ul className='breadcrumb'>
                    <li>media root</li>
                    <li>...</li>
                </ul>
                <div className='row header-options'>
                    <div className='col-lg-6'>
                        <button className='btn btn-sm btn-success' onClick={this.handleShowMediaUpload.bind(this)}>Upload media</button>
                        <button className='btn btn-sm btn-secondary'>New folder</button>
                    </div>
                    <div className='col-lg-4 col-lg-offset-2'>
                        <form>
                            <input className='form-control form-control-sm' type='text' placeholder='Search' />
                        </form>
                    </div>
                </div>

                <div className='card-columns'>
                {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((a, index) => (
                        <div className='card' key={index}>
                            <div className='card-header'>
                                Name of the media
                            </div>
                            <div className='card-block'>
                                <p>Media preview goes here</p>
                            </div>
                            <div className='card-footer'>
                                <span>Action buttons go here</span>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.showMediaUpload && this._renderUploadModal()}
            </div>
        );
    }
}
