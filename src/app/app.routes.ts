import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PowerOnComponent } from './components/power-on/power-on.component';
import { PowerOffComponent } from './components/power-off/power-off.component';
import { SetupComponent } from './components/setup/setup.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HelpComponent } from './components/help/help.component';

export const routes: Routes = [
  { path: '', component: PowerOnComponent },
  { path: 'poweroff', component: PowerOffComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  // Optional: Fallback Route
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}