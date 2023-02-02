import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplDetailInfoComponent } from './bnpl-detail-info.component';

describe('BnplDetailInfoComponent', () => {
  let component: BnplDetailInfoComponent;
  let fixture: ComponentFixture<BnplDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BnplDetailInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
