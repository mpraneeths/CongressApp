import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../dataservice.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  constructor(private service: DataService, public dialogRef: MatDialogRef<AddUserComponent>) { }
  public userForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    surName: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    memberId: new FormControl(''),
    emaild: new FormControl('', [Validators.email]),
    mobile: new FormControl(''),
    twitter: new FormControl(''),
    facebook: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  allUsers : any[] =[];
  isUserExists = false;

  ngOnInit(): void {
    this.userForm.reset();
    this.getAllUsers()
  }
  createUser() {
    for(let user of this.allUsers){
      if(user.userName.toLocaleLowerCase() === this.userForm.get('userName')?.value.toLocaleLowerCase()){
        this.isUserExists = true;
      }
    }
    if (this.userForm.valid && !this.isUserExists) {
      var dataToSend = this.prepareDataToSend();
      this.service.createUser(dataToSend).subscribe((data: any) => {
        if(data){
        this.cancel();
          Swal.fire(
            'Success!',
            'User Creation Successfull',
            'success'
          )
        }
      })
    }
  }
  cancel() {
    this.dialogRef.close();
  }
  hasError(formControlName: any, validation: string) {
    return this.userForm.get(formControlName)?.hasError(validation);
  }
  getAllUsers(){
    this.service.getAllUsers().subscribe((data: any)=>{
      this.allUsers = data;
    })
  }
  prepareDataToSend(){
    return {
      User: this.userForm.get('userName')?.value,
      Surname: this.userForm.get('surName')?.value,
      Role: this.userForm.get('role')?.value,
      MemberId : this.userForm.get('memberId')?.value,
      EmailId: this.userForm.get('emaild')?.value,
      Twitter:this.userForm.get('twitter')?.value,
      Facebook: this.userForm.get('facebook')?.value,
      Mobile: this.userForm.get('mobile')?.value,
      Name: this.userForm.get('name')?.value,
    }
  }
}
