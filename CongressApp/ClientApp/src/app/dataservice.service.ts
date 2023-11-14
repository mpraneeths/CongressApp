import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  public dateSelected = new Subject<any>();

  private getUser() {
    return sessionStorage.getItem('usr');
  }

  public login(userName: string, password: string) {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: httpHeaders };
    return this.http.post('/service/login', JSON.stringify({ 'UserName': userName, 'Password': password }), options);
  }
  public savePassword(password: string) {
    let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: httpHeaders };
    const user = this.getUser();
    return this.http.put('/service/updatePassword', JSON.stringify({ 'UserName': user, 'Password': password }), options);
  }
  public uploadAttachment(attachment: any, file: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    attachment.CreatedBy = this.getUser();
    attachment.CreatedDate = new Date();
    formData.append('File', file, JSON.stringify(attachment));
    return this.http.post('/service/addData', formData, { headers: headers });
  }
  public createitems(items: any) {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    items.CreatedBy = this.getUser();
    items.CreatedDate = new Date();
    let options = { headers: httpHeaders };
    return this.http.post('/service/createitems', items, options);
  }
  public getitems(selectedDate: Date) {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/getitems', { params: { 'date': selectedDate.toDateString() }, headers: httpHeaders });
  }
  public getdata(selectedDate: Date) {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/getdata', { params: { 'selectedDate': selectedDate.toDateString() }, headers: httpHeaders });
  }
  public downloadFile(path: string) {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/downloadFile', { params: { 'filePath': path }, headers: httpHeaders, responseType: 'blob' });
  }
  public createUser(user: any) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    let options = { headers: headers };
    user.CreatedBy = this.getUser();
    user.CreatedDate = new Date();
    return this.http.post('/service/addUser', user, { headers: headers });
  }
  public getAllUsers() {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/usersget', { headers: httpHeaders });
  }
  public getUserattachements(selectedDate: Date, itemName: any) {
    const user = this.getUser();
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/getUserattachements', { params: { 'selectedDate': selectedDate.toDateString(), 'user': user || '', 'itemName': itemName }, headers: httpHeaders });
  }
  public getAllUserAttachments(user: any) {
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.get('/service/getAllUserattachements', { params: { 'user': user }, headers: httpHeaders });
  }
  public deleteAttachment(id: any){
    let httpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    return this.http.delete('/service/deleteattachment', { params: { 'id': JSON.stringify(id) }, headers: httpHeaders })
  }
}
