import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly cookieName: string = 'currentLocation';
  private location: string = 'de';

  public get Location(): string {
    const cookie = this.getCookie(this.cookieName);

    if(cookie && typeof cookie === 'string') {
      return cookie; 
    }
    return this.location;
  }
  public set Location(location: string) {
    if (!location || typeof location !== 'string') {
      throw new Error('Location is not a valid string!');
    }
    this.location = location;
    this.setCookie(this.cookieName, location, 365);
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
