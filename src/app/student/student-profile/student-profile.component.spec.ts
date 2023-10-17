import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import { ProfileComponent } from './student-profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [ProfileComponent],
      providers: [UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
  });


  it('ng OnInit', fakeAsync(() => {
    spyOn(userService, 'getProfile').and.returnValue(of({ name: "user" }));
    const getUserProfile = spyOn(component, 'getUserProfile');
    const createForm = spyOn(component, 'createForm');
    component.ngOnInit();
    expect(getUserProfile).toHaveBeenCalled();
    userService.getProfile().subscribe((value) => {
       component.user = value;
       component.createForm();
    });
    expect(createForm).toHaveBeenCalled();
    expect(component.user.name).toBe("user");
  }));

});
