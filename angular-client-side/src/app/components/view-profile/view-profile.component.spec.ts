import { provideHttpClient } from '@angular/common/http';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import type { User } from '@models/user';
import { UserRestService } from '@services/user-rest/user-rest.service';
import { Subject } from 'rxjs';

import { ViewProfileComponent } from './view-profile.component';

describe('ViewProfileComponent', () => {
  let component: ViewProfileComponent;
  let fixture: ComponentFixture<ViewProfileComponent>;
  let userSubject: Subject<User>;

  beforeEach(async () => {
    userSubject = new Subject<User>();
    await TestBed.configureTestingModule({
      imports: [ViewProfileComponent],
      providers: [
        provideHttpClient(),
        { provide: UserRestService, useValue: { getUser: () => userSubject.asObservable() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the user signal when the profile request emits', () => {
    userSubject.next({ nickname: 'player', teamTag: null });

    expect(component.user().nickname).toBe('player');
  });
});
