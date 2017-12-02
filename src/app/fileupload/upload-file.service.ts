import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';

import {FileUpload} from './fileupload';

@Injectable()
export class UploadFileService {

  //fileUploads: FirebaseListObservable<FileUpload[]>;

  constructor(private db: AngularFireDatabase) {
  }

  //private basePath = '/images';

  // getFileUploads(query = {}) {
  //   this.fileUploads = this.db.list(this.basePath, {
  //     query: query
  //   });
  //   return this.fileUploads
  // }

  pushFileToStorage(fileUpload: FileUpload, progress: {percentage: number}, basePath: String) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${basePath}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        // fail
        console.log("File upload error");
        //return '';
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = fileUpload.file.name;
        //return fileUpload.url;
        //this.saveFileData(fileUpload);
        // this.uploadedFile = {
        //   'url':
        // }
        //console.log("Upload success", fileUpload.url);
      }
    );

    return fileUpload.url;
  }

  // private saveFileData(fileUpload: FileUpload) {
  //   this.db.list(`${this.basePath}/`).push(fileUpload);
  // }
}
