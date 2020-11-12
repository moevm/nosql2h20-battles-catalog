import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareProjectsComponent } from './share-projects.component';

describe('ShareProjectsComponent', () => {
  let component: ShareProjectsComponent;
  let fixture: ComponentFixture<ShareProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
