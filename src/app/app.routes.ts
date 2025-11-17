import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PowerOnComponent } from './components/power-on/power-on.component';
import { PowerOffComponent } from './components/power-off/power-off.component';
import { SetupComponent } from './components/setup/setup.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HelpComponent } from './components/help/help.component';
import { ErrorComponent } from './components/error/error.component';

export const routes: Routes = [
  { path: '', component: PowerOnComponent },
  { path: 'poweron', component: PowerOnComponent },
  { path: 'poweroff', component: PowerOffComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: 'error', component: ErrorComponent },
  // Fallback
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}