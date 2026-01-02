import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@models/user';
import { Team } from '@models/team';
import { Tournament } from '@models/tournament';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { TeamRestService } from '@services/team-rest/team-rest.service';
import { TourneyRestService } from '@services/tourney-rest/tourney-rest.service';
import { FormControl, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import ConfirmedValidator from '@src/app/confirmed.validator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NgClass, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

export interface PeriodicElement {
  name: string;
}

@Component({
    selector: 'app-join-tournament',
    templateUrl: './join-tournament.component.html',
    styleUrls: ['./join-tournament.component.css'],
    imports: [NavBarComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, NgClass, MatInputModule, NgIf, MatButtonModule, MatTableModule, MatCheckboxModule]
})
export class JoinTournamentComponent implements OnInit {
  tourney!: Tournament;
  teams: Team[] = [];
  selectedTeam?: Team;
  userNickname!:string;
  user!:User;
  form: FormGroup = new FormGroup({
    tourneys: new FormControl(''),
  });
  isShow = true;
  tournaments: Tournament[] = [];
  tourneysList: string[] = [];
  idList: number[] = [];
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource!: MatTableDataSource<PeriodicElement>;
  displayedColumns: string[] = ['select', 'name'];
  errorMessage = "";
  selection = new SelectionModel<PeriodicElement>(true, []);


  constructor(private tournamentRestService: TourneyRestService,
     private teamRestService: TeamRestService,
     private userRestService: UserRestService,
     private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUser().subscribe((user) => {
      this.userNickname = user.nickname!;
    });

    this.getTeams().subscribe((data) => {
        this.teams = data;
        this.populateTable();
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    });

    this.getTournaments().subscribe((data) => {
      this.tournaments = data;
      this.populateTourneys();

      this.form = this.formBuilder.group({
        tourneys: ['', Validators.required],
      },
      {
        validators: [ConfirmedValidator.matchUser('tourneys', this.tourneysList)]
      });
    });

  }

  populateTable() {
    const tam = this.teams.length;
    for (let index = 0; index < tam; index++) {
      this.ELEMENT_DATA[index] = {
        name: this.teams[index].name!,
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  populateTourneys() {
    this.selectedTeam = this.teams.find(team => team.name = this.selection.selected[0]?.name)
    this.tournaments.forEach((element:Tournament) => {
      if(element.region === this.selectedTeam?.teamLeader?.linkedAccount?.region) {
        this.tourneysList.push(element.name);
        this.idList.push(element.tournamentId);
      }
    });
  }

  selectTourney(value: string) {
    this.isShow = !this.isShow;
    const index = this.tourneysList.indexOf(value);
    const id = this.idList[index];

    this.getTournament(id).subscribe(tourney => {
      this.tourney = tourney;
 });
  }

  getErrorMessage() {
    if (this.form.get('tourneys')?.hasError('required')) {
      return 'You must enter a value';
    }

    return (this.form.get('tourneys')?.hasError('tourneys') || this.form.get('tourneys')?.errors?.['matching']) ? "This tournament doesn't exist." : "";
  }

  getTournaments() {
    return this.tournamentRestService.getTourneys();
  }

  getTournament(id: number) {
    return this.tournamentRestService.getTourney(id);
  }

  getTeams(): Observable<Team[]> {
    return this.teamRestService.getTeams();
  }

  getUser() {
    return this.userRestService.getUser();
  }

  addTeam(id: number, nickname: string) {
    this.selectedTeam = this.teams.find(team => team.name = this.selection.selected[0]?.name)
    this.tournamentRestService.addTeam(id, nickname).subscribe({
      next: () => {
        this.getUser().subscribe((user) => {
          this.userNickname = user.nickname!;
        });
      },
      error: () => {
        if (this.tourney.rank != this.selectedTeam?.rank) {
          this.errorMessage = "The tournament rank must correspond to team rank."
        }
      }
    });
  }
}
