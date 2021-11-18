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
    console.log('we here')
    this.storage.getProjects()
    .then(p => {
      if (!p || p.length === 0) {
        // starting fresh
        this.projects = [];
        console.log('projects;',this.projects)
      } else {
        // editing
        this.projects = p;
        console.log('projects;',this.projects)
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
      }
    });
  }

  delete(p, i) {
    this.projects.splice(i, 1);
  }

  async finish() {
    console.log('P:',this.projects)
    this.storage.setProjects(this.projects);
    await this.modalCtrl.dismiss({
      'projects': this.projects
    });
  }

}
