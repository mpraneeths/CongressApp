import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../dataservice.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAttachmentsComponent } from '../add-attachments/add-attachments.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isForgotPassword = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService, private dialog: MatDialog) { }
  public loginForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+={}\[\]|\\;:"<>,.?/]).{8,}$')])
  });
  ngOnInit(): void {
    this.loginForm.reset();
  }

  onSubmit(usr: string, pwd: string): void {
    if (this.loginForm.valid) {
      this.dataService.login(usr, pwd).subscribe((data: any) => {
        if (data.error === null && pwd !== 'FirstPass@!123') {
          let token = data.tokenValue;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('usr', usr);
          this.router.navigate(['/home']);
        } else if (data.error === null && pwd === 'FirstPass@!123') {
          let token = data.tokenValue;
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('usr', usr);
          this.router.navigate(['/changePassword']);
        } else {
          Swal.fire(
            'Error!',
            data.error,
            'error'
          )
        }
      });

    }
  }
  hasError(formControlName: string, validation: string) {
    return this.loginForm.get(formControlName)?.hasError(validation);
  }
  reset() {
    this.loginForm.reset();
    this.isForgotPassword = true;
  }
  back() {
    this.loginForm.reset();
    this.isForgotPassword = false;
  }
}
