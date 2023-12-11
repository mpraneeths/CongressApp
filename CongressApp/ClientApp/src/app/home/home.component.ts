import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../dataservice.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AddItemsComponent } from '../add-items/add-items.component';
import { AddAttachmentComponent } from '../add-attachment/add-attachment.component';
import * as FileSaver from 'file-saver';
import { AddUserComponent } from '../add-user/add-user.component';
import Swal from 'sweetalert2';
import { AddAttachmentsComponent } from '../add-attachments/add-attachments.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource: any[] = [];
  attachmentData: any[] = [];
  selectedDate: any;
  items: any = [];
  showSpinner: boolean = false;
  isAdmin : boolean = false;
  isSiteAdmin : boolean = false;
  displayedColumns: string[] = ['timeline', 'facebook', 'twitter', 'instagram', 'youtube', 'newsclips'];
  tableColumns: string[] = ['facebook', 'twitter', 'instagram', 'youtube', 'newsclips'];
  unfilteredDataSource: any[] = [];
  constructor(private router: Router, private service: DataService, private dialog: MatDialog) { }
  choosenDate: FormControl = new FormControl('');

  @ViewChild('top', { static: true }) public topBar: any;
  @ViewChild('datepicker', { static: true }) public datepicker: any;
  @ViewChild('itemcard', { static: true }) public itemcard: any;

  ngOnInit(): void {
    var userName = sessionStorage.getItem('usr');
    if(userName?.toLocaleLowerCase() ==="siteadmin"){
      this.isSiteAdmin = true;
    }else if(userName?.toLocaleLowerCase() ==="admin"){
      this.isAdmin = true;
    }else{
      this.isAdmin = false;
      this.isSiteAdmin = false;
    }
    this.choosenDate.reset();
    this.dataSource = this.createTimeline();
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  createTimeline() {
    var elementData = [];
    for (let i = 0; i < 24; i++) {
      var timeLine = { timeline: `${i} hrs`, facebook: [], twitter: [], instagram: [], youtube: [], newsclips:[] };
      elementData.push(timeLine);
    }
    return elementData;
  }
  getEntireData($event: any) {
    if ($event.value) {
      this.selectedDate = $event.value;
      this.service.getitems($event.value).subscribe((data: any) => {
        this.bringSpinner();
        this.items = data;
        this.hideSpinner();
      });
      this.service.getdata(this.selectedDate).subscribe((data: any) => {
        this.bringSpinner();
        this.dataSource = this.createTimeline();
        this.attachmentData = data;
        for (let attdata of this.attachmentData) {
          var rowItem = this.dataSource.find(row => row.timeline == attdata.timeSelected);
          rowItem[attdata.columnName].push({ fileName: attdata.isLink? attdata.filePath : attdata.filename, filePath: attdata.filePath, isLink: attdata.isLink });
        }
        this.hideSpinner();
      })
    }
  }
  isDisabled() {
    return this.choosenDate.value === null;
  }
  openItems() {
    if (this.selectedDate) {
      const dialogRef = this.dialog.open(AddItemsComponent, { data: {date: this.selectedDate, items: this.items} });
      dialogRef.afterClosed().subscribe(result => {
        this.getEntireData(this.choosenDate);
      })
    }
  }
  bringSpinner() {
    this.showSpinner = true;
  }
  hideSpinner() {
    this.showSpinner = false;
  }
  get tableHeightCalc() {
    let height = this.topBar.nativeElement.clientHeight + this.datepicker._elementRef.nativeElement.clientHeight + this.itemcard.nativeElement.clientHeight + 50;
    return `calc(100vh - ${height}px)`;
  }
  openAttachmentPopup(index: any, colName: string) {
    if (this.selectedDate) {
      const dialogRef = this.dialog.open(AddAttachmentComponent, { data: { "selectedDate": this.selectedDate, "index": index, "colName": colName } });
      dialogRef.afterClosed().subscribe(result => {
        this.getEntireData(this.choosenDate);
      })
    }
  }

  download(filePath: any, fileName: any, isLink: boolean) {
    if(isLink){
      this.redirectToURL(filePath);
      return;
    }
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
  openAddUser(){
   this.dialog.open(AddUserComponent); 
  }
  getcolorsForItems(itemName: any){
    var itemCount = this.attachmentData?.filter(x=>x.selectedItem === itemName).length;
    if(itemCount >= 5 && itemCount < 10){
      return 'orange-card';
    }else if(itemCount >= 10){
      return 'green-card';
    }else{
      return 'red-card';
    }
  }
  applyFilter(itemName: string){
    if (this.selectedDate) {
      const dialogRef = this.dialog.open(AddAttachmentsComponent, { data: {selectedDate: this.selectedDate, itemName: itemName}});
      dialogRef.afterClosed().subscribe(result => {
        this.getEntireData(this.choosenDate);
      })
    }
  }
  redirectToUsers(){
    this.router.navigate(['/userlist']);
  }
  redirectToURL(url:string){
    window.open(url, '_blank');
  }
}
