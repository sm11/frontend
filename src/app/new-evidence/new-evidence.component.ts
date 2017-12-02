import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import {UploadFileService} from '../fileupload/upload-file.service';
import {FileUpload} from '../fileupload/fileupload';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//import { FileUploadComponent } from '../file-upload-section';

interface NewEvidence {
  audio: string;
  doc: string;
  image: string;
  video : string;
  timestamp : Date;
  userId : string;
  what : string;
  when : Date;
  where : string;
  display: boolean;
}

@Component({
  selector: 'new-evidence',
  templateUrl: './new-evidence.component.html',
  styleUrls: ['./new-evidence.component.css']
})
export class NewEvidenceComponent {

  evidencesCol: AngularFirestoreCollection<NewEvidence>;
  evidences: Observable<NewEvidence[]>;
  newEvidence: NewEvidence;

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: {percentage: number} = {percentage: 0};

  viewLog: boolean;
  viewLogMessage: String;
  hideLogMessage: String;

  constructor(private afs: AngularFirestore, private uploadService: UploadFileService, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.evidencesCol = this.afs.collection('evidence-logs');
    this.evidences = this.evidencesCol.valueChanges();
    //console.log(this.evidences);

    this.viewLog = false;
    this.viewLogMessage = "View previous entries";
    this.hideLogMessage = "Hide entries";

    this.newEvidence = {
      audio: '',
      doc: '',
      image: '',
      video: '',
      timestamp: new Date(),
      userId: '12345',
      what: '',
      when: new Date(),
      where: '',
      display: true
    }
  }

  toggleViewLog() {
    this.viewLog = !this.viewLog;
  }

  selectFile(event, basePath) {
    this.selectedFiles = event.target.files;
    this.upload(basePath);
  }

  upload(basePath) {
    const file = this.selectedFiles.item(0);
    this.currentFileUpload = new FileUpload(file);
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${basePath}/${this.currentFileUpload.file.name}`).put(this.currentFileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        this.progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        console.log("File upload error");
      },
      () => { // success
        this.currentFileUpload.url = uploadTask.snapshot.downloadURL;
        this.currentFileUpload.name = this.currentFileUpload.file.name;
        //console.log(this.currentFileUpload);
        if(basePath == '/images') {
          this.newEvidence.image = this.currentFileUpload.url;
        } else if(basePath == '/audio') {
          this.newEvidence.audio = this.currentFileUpload.url;
        } else if(basePath == '/doc') {
          this.newEvidence.doc = this.currentFileUpload.url;
        } else if(basePath == '/video') {
          this.newEvidence.video = this.currentFileUpload.url;
        }
      }
    );
  }

  addNewEvidence() {
    this.newEvidence.timestamp = new Date();
    this.newEvidence.userId = '12345';
    //console.log(this.newEvidence);
    this.afs.collection('evidence-logs').add(this.newEvidence);

    // success callback
    this.newEvidence = {
      audio: '',
      doc: '',
      image: '',
      video: '',
      timestamp: new Date(),
      userId: '12345',
      what: '',
      when: new Date(),
      where: '',
      display: true
    }
  }

  deleteEvidence(evidence){
    console.log("Delete evidence");
    // TODO: edit display to False
  }

}
