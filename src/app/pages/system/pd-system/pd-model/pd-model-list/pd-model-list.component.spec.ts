import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdModelListComponent } from './pd-model-list.component';

describe('PdModelListComponent', () => {
  let component: PdModelListComponent;
  let fixture: ComponentFixture<PdModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdModelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
