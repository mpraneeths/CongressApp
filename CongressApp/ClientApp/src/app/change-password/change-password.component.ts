import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataService } from '../dataservice.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  constructor(private router: Router, private service: DataService) { }
  public userForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+={}\[\]|\\;:"<>,.?/]).{8,}$')]),
    changePassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+={}\[\]|\\;:"<>,.?/]).{8,}$')])
  });

  ngOnInit(): void {
    this.userForm.reset();
  }
  cancel() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  passwordConfirming(): ValidationErrors | null {
    if (this.userForm?.get('password')?.value !== this.userForm?.get('changePassword')?.value) {
      return { passwordMatch: true };
    }
    return null;
  }
  hasError(formControlName: string, validation: string) {
    return this.userForm.get(formControlName)?.hasError(validation);
  }
  passwordChange(){
    if(this.userForm.valid){
      if(this.userForm?.get('password')?.value!==this.userForm?.get('changePassword')?.value){
        Swal.fire(
          'Error!',
          'Password and Verify Password not matched',
          'error'
        )
      }else{
        this.service.savePassword(this.userForm?.get('password')?.value).subscribe((data: any) => {
          if (data) {
            Swal.fire(
              'Success!',
              'Password Changed Successfully',
              'success'
            )
            this.router.navigate(['/home']);
            this.userForm.reset();
          }else{
            Swal.fire(
              'Error!',
              'Password Change Unsuccessful, Please try again later',
              'error'
            )
          }
        });
      }
    }
  }
}
