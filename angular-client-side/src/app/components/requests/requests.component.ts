import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface PeriodicElement {
  requestId: number,
  tag: string;
  teamLeader: string;
  teamName: string;
  members: number;
}

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  selectedValue!: string;
  requestID!: number;
  requests: any = [];
  ELEMENT_DATA: PeriodicElement[] = [];
  //titles: any[] = ['Tag', 'Team Leader', 'Team Name', 'Current Total of Members'];

  columns = [
    {
      columnDef: 'select',
    },
    {
      columnDef: 'tag',
      header: 'Tag',
      cell: (element: PeriodicElement) => `${element.tag}`,
    },
    {
      columnDef: 'teamLeader',
      header: 'Team Leader',
      cell: (element: PeriodicElement) => `${element.teamLeader}`,
    },
    {
      columnDef: 'teamName',
      header: 'Team Name',
      cell: (element: PeriodicElement) => `${element.teamName}`,
    },
    {
      columnDef: 'members',
      header: 'Current Total of Members',
      cell: (element: PeriodicElement) => `${element.members}`,
    },
  ];

  columnsMobile = [
    {
      columnDef: 'teamLeader',
      header: 'Team Leader',
    },
    {
      columnDef: 'teamName',
      header: 'Team Name',
    },
    {
      columnDef: 'members',
      header: 'Current Total of Members',
    },
  ];
  dataSource: any;
  displayedColumns = this.columns.map(c => c.columnDef);
  displayedMobileColumns = this.columnsMobile.map(c => c.columnDef);
  panelOpenState = false;
  selection = new SelectionModel<PeriodicElement>(true, []);

  constructor(private router: Router, private restService: UserRestService) { }

  ngOnInit(): void {
    this.getRequests().subscribe((data: {}) => {
      this.requests = data;
      this.populateTable();
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    });
  }

  populateTable() {
    for (let index = 0; index < this.getRequestSize(); index++) {
      this.ELEMENT_DATA[index] = {
        requestId: this.requests[index].requestId,
        tag: this.requests[index].team.tag, 
        teamLeader: this.requests[index].team.teamLeader, 
        teamName: this.requests[index].team.name, 
        members: this.requests[index].team.numberMembers
      };
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.tag + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRequests() {
    return this.restService.getRequests();
  }

  getRequestSize(): number {
    return this.requests.length;
  }

  getRequestID(): number {
    return (this.selection.selected[0]?.requestId == undefined) ? 
      this.requestID = (this.selectedValue.slice(0,1) as any) : 
      this.requestID = this.selection.selected[0]?.requestId;
  }

  acceptRequest() {
    this.requestID = this.getRequestID();
    this.restService.acceptRequest(this.requestID).subscribe({
       next: () => {
         this.router.navigate(['/view-my-team']);
       },
       error: (err: any) => console.log(err)
     });
  }

  refuseRequest() {
    this.requestID = this.getRequestID();
    this.restService.acceptRequest(this.requestID).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => console.log(err)
    });
  }

}
