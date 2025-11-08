import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // Singleton Service verfügbar in der ganzen App
})
export class ThemeService {
  private readonly cookieName = 'darkMode';

  isDarkMode(): boolean {
    const cookie = this.getCookie(this.cookieName);
    return cookie === true.toString();
  }

  setDarkMode(isDark: boolean): void {
    this.setCookie(this.cookieName, isDark.toString(), 365);
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }
}
