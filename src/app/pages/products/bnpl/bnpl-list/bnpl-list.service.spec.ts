import { TestBed } from '@angular/core/testing';

import { BnplListService } from './bnpl-list.service';

describe('BnplListService', () => {
  let service: BnplListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnplListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
