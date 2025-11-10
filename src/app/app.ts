import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from './services/theme';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocationService } from './services/location';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TranslateModule, NgbModule, MatIconModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('cube');
  protected readonly currentYear: number = new Date().getFullYear();
  private translate = inject(TranslateService);
  public isDarkMode: boolean;
  public isCollapsed = true;

  constructor(
    private locationService: LocationService,
    private themeService: ThemeService
  ) {
    this.translate.addLangs(['de', 'en']);
    this.translate.setFallbackLang('en');
    this.translate.use(this.locationService.Location);

    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.setDarkMode(this.isDarkMode);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }
}