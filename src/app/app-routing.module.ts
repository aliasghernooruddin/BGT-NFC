import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '',  redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './bgt/login/login.module#LoginPageModule' },
  { path: 'menu', loadChildren: './bgt/menu/menu.module#MenuPageModule' },
  { path: 'eventlisting', loadChildren: './bgt/event-listing/event-listing.module#EventListingPageModule' },
  { path: 'eventdetails', loadChildren: './bgt/event-details/event-details.module#EventDetailsPageModule' },
  { path: 'eventcompetition', loadChildren: './bgt/event-competition/event-competition.module#EventCompetitionPageModule' },
  { path: 'eventcompdetails', loadChildren: './bgt/eventcompdetails/eventcompdetails.module#EventcompdetailsPageModule' },
  { path: 'userevents', loadChildren: './bgt/userevents/userevents.module#UsereventsPageModule' },
  { path: 'usereventdetails', loadChildren: './bgt/usereventdetails/usereventdetails.module#UsereventdetailsPageModule' },
  { path: 'judgeevent', loadChildren: './bgt/judgeevent/judgeevent.module#JudgeeventPageModule' },
  { path: 'user-signup', loadChildren: './bgt/user-signup/user-signup.module#UserSignupPageModule' },
  { path: 'eventleaderboard', loadChildren: './bgt/event-leaderboard/event-leaderboard.module#EventLeaderboardPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }