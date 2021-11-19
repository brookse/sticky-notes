import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ChooseProjectsPage } from '../choose-projects/choose-projects.page';
import { StorageService } from '../storage.service';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  projects;
  lastSave;
  showInfo;

  constructor(public modalCtrl: ModalController, private storage: StorageService,
    public alertCtrl: AlertController, public events: EventsService
  ) {
    this.showInfo = false;
  }

  ionViewWillEnter() {
    this.storage.getProjects()
    .then(allProjects => {
      if (!allProjects || allProjects.length === 0) {
        this.promptForProjects();
      } else {
        this.projects = allProjects;
      }
    });

    this.events.subscribe('saved', (data: any) => {
      this.lastSave = data.time;
    });
  }

  async promptForProjects() {
    const modal = await this.modalCtrl.create({
      component: ChooseProjectsPage,
      // cssClass: 'template',
      backdropDismiss: true,
      swipeToClose: true
    });
    await modal.present();
    let p = await modal.onWillDismiss();
    this.projects = p.data.projects;
  }

  saveNotes() {
    this.storage.setProjects(this.projects);
  }

  async clearWeek() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Clear notes',
      message: 'Ready to refresh? All notes will be cleared',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Clear \'em!',
          handler: () => {
            for (let i=0; i<this.projects.length; i++) {
              this.projects[i].notes = {
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: ''
              };
            }
            this.storage.setProjects(this.projects);
          }
        }
      ]
    });

    await alert.present();
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
}
