import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplListComponent } from './bnpl-list.component';

describe('BnplListComponent', () => {
  let component: BnplListComponent;
  let fixture: ComponentFixture<BnplListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
