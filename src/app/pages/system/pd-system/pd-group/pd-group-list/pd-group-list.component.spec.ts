import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdGroupListComponent } from './pd-group-list.component';

describe('PdGroupListComponent', () => {
  let component: PdGroupListComponent;
  let fixture: ComponentFixture<PdGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
