import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../dataservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-attachments',
  templateUrl: './add-attachments.component.html',
  styleUrls: ['./add-attachments.component.css']
})
export class AddAttachmentsComponent implements OnInit {
  userData: any;
  constructor(public dialogRef: MatDialogRef<AddAttachmentsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private service: DataService){}

  showLoginError : any
ngOnInit(): void {
  this.service.getUserattachements(this.data.selectedDate, this.data.itemName).subscribe((data: any)=>{
    this.userData = data;
  });
}
ok(){
  this.dialogRef.close();
}
download(filePath: any, fileName: any) {
  this.service.downloadFile(filePath).subscribe((data:any)=>{
    if(data){
      const url = window.URL.createObjectURL(data);
      const anchorElement = document.createElement('a');
      anchorElement.href = url;
      anchorElement.download = fileName;
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
      Swal.fire(
        'Success!',
        'File downloaded Successfully',
        'success'
      )
    }
  })
}
delete(id: any){
  this.service.deleteAttachment(id).subscribe((data:any)=>{
    if(data){
      Swal.fire(
        'Success!',
        'Attachment deleted Successfully',
        'success'
      )
      this.dialogRef.close();
    }
  })
}
}
