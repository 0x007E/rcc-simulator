import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface WindowWithGA extends Window {
  [key: string]: any;
}
declare let window: WindowWithGA;

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private consentKey = 'cookie_consent_rcc_app';

  private consentSubject = new BehaviorSubject<string | null>(this.getCookie(this.consentKey));
  consent$ = this.consentSubject.asObservable();

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  setConsent(value: 'accepted' | 'rejected'): void {
    this.setCookie(this.consentKey, value, 30);
    this.consentSubject.next(value);

    if (value === 'accepted') {
      this.loadGoogleAnalytics();
      window['ga-disable-G-D1Y61GZ21K'] = false;
    } else {
      window['ga-disable-G-D1Y61GZ21K'] = true;
    }
  }

  getConsent(): string | null {
    return this.getCookie(this.consentKey);
  }

  loadGoogleAnalytics(): void {
    if (document.getElementById('ga-script')) return;

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-D1Y61GZ21K';
    document.head.appendChild(script);

    script.onload = () => {
      window['dataLayer'] = window['dataLayer'] || [];
      function gtag(...args: any[]) { window['dataLayer'].push(args); }
      window['gtag'] = gtag;
      gtag('js', new Date());
      gtag('config', 'G-D1Y61GZ21K');
    };
  }
}