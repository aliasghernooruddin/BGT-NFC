import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventcompdetailsPage } from './eventcompdetails.page';

const routes: Routes = [
  {
    path: '',
    component: EventcompdetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventcompdetailsPage]
})
export class EventcompdetailsPageModule {}
