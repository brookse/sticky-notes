import { Component, HostListener } from '@angular/core';
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
  headers;
  textHeight = 5;

  constructor(public modalCtrl: ModalController, private storage: StorageService,
    public alertCtrl: AlertController, public events: EventsService
  ) {
    this.showInfo = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustHeaders();
  }

  adjustHeaders() {
    let screenWidth = window.innerWidth;
    if (screenWidth <= 300) {
      this.headers = { mo: 'M', tu: 'T', we: 'W', th: 'R', fr: 'F' };
    } else if (screenWidth <= 475) {
      this.headers = { mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri' };
    } else {
      this.headers = { mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday', fr: 'Friday' };
    }
  }

  increaseHeight() {
    this.textHeight++;
  }

  reduceHeight() {
    if (this.textHeight > 5) {
      this.textHeight--;
    }
  }

  ionViewWillEnter() {
    this.adjustHeaders();
    this.storage.getProjects()
    .then(allProjects => {
      if (!allProjects || allProjects.length === 0) {
        this.promptForProjects();
      } else {
        this.projects = allProjects;
        // migration: check if isOff is there, if not added it.
        if (!this.projects.isOff) {
          this.projects.isOff = {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
          };
        }
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
    if (p && p.data) {
      this.projects = p.data.projects;
    }
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

  toggleOffStatus(dayOff) {
    this.projects.isOff[dayOff] = !this.projects.isOff[dayOff];
  }
}
