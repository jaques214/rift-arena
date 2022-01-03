import { User } from '@models/user';
import { Request } from '@models/request';
import { Router } from '@angular/router';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { LinkedList } from 'linked-list-typescript';

export interface PeriodicElement {
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
  r = {
    requestId: 1,
    user: null, 
    teamTag: "TeamTag",
    team: {
      teamLeader: "Jaques Resende",
      teamName: "Team 1",
      numberMembers: 4,
    },
    accepted: 1,
  };
  requests: any[] = [this.r];
  ELEMENT_DATA: PeriodicElement[] = [
    {tag: this.requests[0].teamTag, 
      teamLeader: this.requests[0].team.teamLeader, 
      teamName: this.requests[0].team.teamName, 
      members: this.requests[0].team.numberMembers
    },
  ]
  titles: any[] = ['Tag', 'Team Leader', 'Team Name', 'Current Total of Members'];
  displayedColumns: any[] = ['tag', 'teamLeader', 'teamName', 'members'];
  data$!: Observable<any>;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  panelOpenState = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private restService: UserRestService, private router: Router) { }

  ngOnInit(): void {
    this.getRequests();
    console.log(this.displayedColumns[0].column);
    console.log(this.requests);
    console.log(this.ELEMENT_DATA);
  }

  getRequests(): Observable<LinkedList<Request>> {
    return this.restService.getRequests();
  }

  getRequestSize(): number {
    return this.requests.length;
  }

  getTitle(value: string) {
    const index = this.displayedColumns.indexOf(value);
    return this.titles[index];
  }

}
