import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTimeLogComponent } from './user-time-log.component';

describe('UserTimeLogComponent', () => {
  let component: UserTimeLogComponent;
  let fixture: ComponentFixture<UserTimeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTimeLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTimeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
