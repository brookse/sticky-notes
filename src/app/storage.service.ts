import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { EventsService } from './events.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage, private events: EventsService) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // DB stuff
  public setProjects(value: any) {
    this._storage?.set('projects', value);
    this.events.publish('saved', {
      time: moment().format('h:mm:ss a')
    });
  }

  public getProjects() {
    return this._storage?.get('projects');
  }
}
