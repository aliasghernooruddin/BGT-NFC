import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
 
import { IonicModule } from '@ionic/angular';
 
import { MenuPage } from './menu.page';
 
const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'eventlisting',
        loadChildren: '../event-listing/event-listing.module#EventListingPageModule'
      },
      {
        path: 'eventdetails',
        loadChildren: '../event-details/event-details.module#EventDetailsPageModule'
      },
      {
        path: 'eventcompetition',
        loadChildren: '../event-competition/event-competition.module#EventCompetitionPageModule'
      },
      {
        path: 'eventcompdetails',
        loadChildren: '../eventcompdetails/eventcompdetails.module#EventcompdetailsPageModule'
      },
      {
        path: 'userevents',
        loadChildren: '../userevents/userevents.module#UsereventsPageModule'
      },
      {
        path: 'usereventdetails',
        loadChildren: '../usereventdetails/usereventdetails.module#UsereventdetailsPageModule'
      },
      { path: 'judgeevent', loadChildren: '../judgeevent/judgeevent.module#JudgeeventPageModule' },
      { path: 'eventleaderboard', loadChildren: '../event-leaderboard/event-leaderboard.module#EventLeaderboardPageModule' },
    ]
  }
];
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ MenuPage ]
})
export class MenuPageModule { }