import { Component, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../dataservice.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserDataComponent } from '../user-data/user-data.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [];
  userData : any = [];
  dataSource : any = [];
  tempCols : string[] = [];
  constructor(private service: DataService, private router: Router, private dialog: MatDialog){}

  ngOnInit(): void {
  this.service.getAllUsers().subscribe((data:any)=>{
    this.userData = data;
    this.tempCols = Object.keys(this.userData[0]);
    this.tempCols.splice(this.tempCols.indexOf("_id"), 1);
    this.tempCols.splice(this.tempCols.indexOf("createdBy"), 1);
    this.tempCols.splice(this.tempCols.indexOf("password"), 1);
    this.tempCols.splice(this.tempCols.indexOf("createdDate"), 1);

    this.tempCols.forEach(x=>{
      this.displayedColumns.push(x.toUpperCase())
    })
    this.dataSource = data;
  })
  }
  goBack(){
    this.router.navigate(['/home']);
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  openUserReleatedAttachments(row: any){
    if (row.userName) {
      const dialogRef = this.dialog.open(UserDataComponent, { data: row.userName });
    }
  }
}
