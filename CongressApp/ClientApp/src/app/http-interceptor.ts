import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddAttachmentsComponent } from './add-attachments/add-attachments.component';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          Swal.fire(
            'Error!',
            'Something went wrong. Please Contact Support',
            'error'
          )
          return throwError(error);
        })
      )
  }
}