import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidebarsComponent } from './slidebars.component';

describe('SlidebarsComponent', () => {
  let component: SlidebarsComponent;
  let fixture: ComponentFixture<SlidebarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidebarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidebarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
