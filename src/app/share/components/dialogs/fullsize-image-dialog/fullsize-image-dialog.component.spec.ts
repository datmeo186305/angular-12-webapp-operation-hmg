import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullsizeImageDialogComponent } from './fullsize-image-dialog.component';

describe('FullsizeImageDialogComponent', () => {
  let component: FullsizeImageDialogComponent;
  let fixture: ComponentFixture<FullsizeImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullsizeImageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullsizeImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
