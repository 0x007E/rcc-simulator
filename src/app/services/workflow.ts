import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Workflow } from '../classes/workflow';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private file: string = '';

  constructor(
    private http: HttpClient,
    private router: Router) { }

  public setFile(file: string) {
    this.file = file;
  }

  public get Workflow(): Observable<Workflow> {
    return this.http.get<any>(this.file).pipe(
        map(jsonData => new Workflow(jsonData)),
        catchError(error => {
          this.router.navigate(['/error'], { queryParams: { error: error.message } });
          return throwError(() => error);
        })
      );
  }


}