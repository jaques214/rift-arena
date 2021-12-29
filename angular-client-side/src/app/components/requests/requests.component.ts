import { Request } from '@models/request';
import { Router } from '@angular/router';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { LinkedList } from 'linked-list-typescript';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests: Request[] = [];
  displayedColumns: string[] = ['Nickname', 'Team Leader', 'Team Name', 'Current Total of Members'];
  data$!: Observable<any>;
  dataSource = new MatTableDataSource(this.requests);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private restService: UserRestService, private router: Router) { }

  ngOnInit(): void {
    this.getRequests();
  }

  getRequests(): Observable<LinkedList<Request>> {
    return this.restService.getRequests();
  }

  getRequestSize(): number {
    return this.requests.length;
  }

}
