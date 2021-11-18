import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseProjectsPage } from './choose-projects.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseProjectsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseProjectsPageRoutingModule {}
