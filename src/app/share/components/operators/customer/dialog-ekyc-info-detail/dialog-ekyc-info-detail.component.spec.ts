import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEkycInfoDetailComponent } from './dialog-ekyc-info-detail.component';

describe('DialogEkycInfoDetailComponent', () => {
  let component: DialogEkycInfoDetailComponent;
  let fixture: ComponentFixture<DialogEkycInfoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEkycInfoDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEkycInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
