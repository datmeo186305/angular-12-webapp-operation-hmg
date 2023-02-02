import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplElementComponent } from './bnpl-element.component';

describe('BnplElementComponent', () => {
  let component: BnplElementComponent;
  let fixture: ComponentFixture<BnplElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnplElementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
