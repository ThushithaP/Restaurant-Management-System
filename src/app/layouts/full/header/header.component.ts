import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';

declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  showMenu = false;
  showDropdown: boolean = false;
  dropdownVisible: any;
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }

  decodedToken: any = jwtDecode(localStorage.getItem('token') || '');
  user: any;
  prof: any;
  formProf: any = FormGroup;
  ChangeP: any = FormGroup;
  formCp: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}
  ngOnInit() {
    this.prof = new window.bootstrap.Modal(document.getElementById('ff'));
    this.formCp = new window.bootstrap.Modal(document.getElementById('pass'));
    this.formProf = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.ChangeP = this.formBuilder.group({
      email: [null, [Validators.required]],
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = jwt_decode(token);
      this.user = {
        email: this.decodedToken.email,
        name: this.decodedToken.name,
      };
    }
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
  openProf() {
    this.prof.show();
  }
  openP() {
    this.formCp.show();
  }

  closeProf() {
    this.prof.hide();
  }
  closeP() {
    this.formCp.hide();
  }

  onSubmitProf(formdata: NgForm) {
    var profData = formdata.value;
    var data = {
      name: profData.name,
      email: profData.email,
      phoneNumber: profData.phoneNumber || null,
      password: profData.password || null,
    };
    console.log(profData);
    this.customerService.updateProf(data).subscribe(
      (response: any) => {
        this.prof.hide();
        this.toastr.success('Updated Succesfully');
      },
      (error) => {
        this.toastr.error('Password is Incorrect');
        console.log(data);
      }
    );
  }
  onSubmitPass(formCData: NgForm) {
    var pass = formCData.value;
    var data = {
      email: pass.email,
      oldPassword: pass.oldPassword,
      newPassword: pass.newPassword,
    };

    this.customerService.updatePass(data).subscribe(
      (response: any) => {
        this.formCp.hide();
        this.toastr.success(
          'Password Updated Succesfully...Please Login again'
        );
        localStorage.clear();
        this.router.navigate(['/']);
      },
      (error) => {
        this.toastr.error('Old Password is Incorrect');
      }
    );
  }

  userS = {
    email: '',
    name: '',
    phoneNumber: '',
    password: '',
  };

  userP = {
    email: '',
    oldPassword: '',
    newPassword: '',
  };
}
