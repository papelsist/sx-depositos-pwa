import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutotirzacionesTabPage } from './autotirzaciones-tab.page';

describe('AutotirzacionesTabPage', () => {
  let component: AutotirzacionesTabPage;
  let fixture: ComponentFixture<AutotirzacionesTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutotirzacionesTabPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutotirzacionesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
