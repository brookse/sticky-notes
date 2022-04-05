import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-choose-projects',
  templateUrl: './choose-projects.page.html',
  styleUrls: ['./choose-projects.page.scss'],
})
export class ChooseProjectsPage {
  projects;

  constructor(private modalCtrl: ModalController, private storage: StorageService) {
    this.storage.getProjects()
    .then(p => {
      if (!p || p.length === 0) {
        // starting fresh
        this.projects = [];
      } else {
        // editing
        // migration: check if isOff is there, if not added it.
        if (!p.isOff) {
          p.isOff = {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
          };
        }
        this.projects = p;
      }
    });
  }

  addProject() {
    this.projects.push({
      name: '',
      notes: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: ''
      },
      isOff: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false
      }
    });
  }

  delete(p, i) {
    this.projects.splice(i, 1);
  }

  async finish() {
    this.storage.setProjects(this.projects);
    await this.modalCtrl.dismiss({
      'projects': this.projects
    });
  }

}
