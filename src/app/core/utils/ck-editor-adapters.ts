import {environment} from "../../../environments/environment";

export default class CkEditorAdapters {
  loader: any;
  reader;
  config;
  xhr: any;
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
  }

  read(file) {
    console.log(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        resolve({ default: reader.result });
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.onabort = function () {
        reject();
      };
      reader.readAsDataURL(file);
    });
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  tokenGetter() {
    let coreState = JSON.parse(localStorage.getItem('core'));
    return coreState?.login?.authorization?.token;
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open('POST', environment.API_BASE_URL + environment.COM_API_PATH +  environment.UPLOAD_FILE_CKEDITOR_PATH, true); // TODO change the URL
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.tokenGetter());
  }
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }
      resolve({
        default: response.url,
      });
    });
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
  _sendRequest(file) {
    const data = new FormData();
    data.append('file', file);
    this.xhr.send(data);
  }
}
