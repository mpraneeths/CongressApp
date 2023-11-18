import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../dataservice.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-attachment',
  templateUrl: './add-attachment.component.html',
  styleUrls: ['./add-attachment.component.css']
})
export class AddAttachmentComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AddAttachmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: DataService){}

  items: any;
  selectedItem: any;
  selectedColumn: any;
  fileToUpload: any;
  isLink =false;
  link: any;

  ngOnInit(): void {
  this.link = new FormControl('');
    this.service.getitems(this.data.selectedDate).subscribe((data: any)=>{
      this.items = data.createdItems;
    });
  }
  addAttachment(){
    let dataToSend = this.prepareDataToSend();
    if(this.isLink){
      this.service.addDataAsLink(dataToSend).subscribe((data: any)=>{
        if(data){
          this.cancel();
          Swal.fire(
            'Success!',
            'Attachment Added Successfully',
            'success'
          )
        }
      })
    }else{
      this.service.uploadAttachment(dataToSend, this.fileToUpload).subscribe((data: any)=>{
        if(data){
          this.cancel();
          Swal.fire(
            'Success!',
            'Attachment Added Successfully',
            'success'
          )
        }
      })
    }

  }
  cancel(){
    this.dialogRef.close();
  }
  itemChanged($event: any){
    this.selectedItem = $event.value
  }
  itemTypeChanged($event: any){
    if($event.checked){
      this.isLink = true;
    }else{
      this.isLink = false;
    }
  }
  prepareDataToSend(){
    return{
      SelectedDateTime : this.data.selectedDate.toDateString(),
      TimeSelected : this.data.index + " hrs",
      ColumnName: this.data.colName,
      SelectedItem : this.selectedItem.name,
      Filename : this.isLink? null : this.fileToUpload.name,
      FilePath: this.isLink? this.link.value: ''
    }
  }
  onSubmit(event: any){
    this.fileToUpload = event.target.files.item(0);
  }
}
