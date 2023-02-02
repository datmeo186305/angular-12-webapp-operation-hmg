import { TestBed } from '@angular/core/testing';

import { ConfigDocumentListService } from './config-document-list.service';

describe('ConfigDocumentListService', () => {
  let service: ConfigDocumentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigDocumentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
