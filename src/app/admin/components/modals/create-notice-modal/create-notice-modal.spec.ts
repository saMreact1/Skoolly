import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNoticeModal } from './create-notice-modal';

describe('CreateNoticeModal', () => {
  let component: CreateNoticeModal;
  let fixture: ComponentFixture<CreateNoticeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNoticeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNoticeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
