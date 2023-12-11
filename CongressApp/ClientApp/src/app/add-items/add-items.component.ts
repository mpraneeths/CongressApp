import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../dataservice.service';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.css']
})
export class AddItemsComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddItemsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: DataService){}
  ItemNameControl: any;
  ngOnInit(): void {
    this.ItemNameControl = new FormControl('', [Validators.required, Validators.min(1)]);
  }
  
  addItem(){
    if(this.data.items.createdItems.find((x:any) =>x.name.toLocaleLowerCase() === this.ItemNameControl.value.toLocaleLowerCase())){
      Swal.fire(
        'Error!',
        this.ItemNameControl.value + ' already exists',
        'error'
      );
      return;
    }
    var dataToSend ={
      ItemDate : this.data.date.toDateString(),
      CreatedItems : [{Index : 1, Name: this.ItemNameControl.value}]
    }
    this.service.createitems(dataToSend).subscribe((data: any)=>{
      if(data){
        this.cancel();
        Swal.fire(
          'Success!',
          'Items Added Successfully',
          'success'
        )
      }
    })


  }
  cancel(){
    this.ItemNameControl.reset();
    this.dialogRef.close();
  }
  hasError(validation: string) {
    return this.ItemNameControl.hasError(validation);
  }
}
