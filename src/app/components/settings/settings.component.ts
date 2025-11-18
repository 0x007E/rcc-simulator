import { Component, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { MatIconModule } from '@angular/material/icon';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme';
import { LocationService } from '../../services/location';
import { CookieConsentService } from '../../services/cookie';

@Component({
  selector: 'app-settings-component',
  imports: [TranslatePipe, MatIconModule, NgbDropdownModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {

  protected cookiesAccepted!: boolean;
  protected isDarkMode!: boolean;

  constructor(
    private locationService: LocationService,
    private translateService: TranslateService,
    private themeService: ThemeService,
    private cookieService: CookieConsentService
  ) {

    this.translateService.addLangs(['de', 'en']);
    this.translateService.setFallbackLang('en');
    this.translateService.use(this.locationService.Location);

    this.isDarkMode = this.themeService.isDarkMode();
    this.cookiesAccepted = (this.cookieService.getConsent() === 'accepted') ? true : false;
  }

  public ngOnInit() {
    this.cookieService.consent$.subscribe(status => {
      this.cookiesAccepted = (status === 'accepted') ? true : false;
    });
  }
  
  selectLanguage(identifier: string) {
    this.locationService.Location = identifier;
    this.translateService.use(identifier);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }

  
  toggleCookies() {
    if (this.cookiesAccepted) {
      this.cookieService.setConsent('rejected');
    } else {
      this.cookieService.setConsent('accepted');
    }
  }
}
