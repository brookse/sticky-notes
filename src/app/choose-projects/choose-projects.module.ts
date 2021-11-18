import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChooseProjectsPageRoutingModule } from './choose-projects-routing.module';

import { ChooseProjectsPage } from './choose-projects.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChooseProjectsPageRoutingModule
  ],
  declarations: [ChooseProjectsPage]
})
export class ChooseProjectsPageModule {}
