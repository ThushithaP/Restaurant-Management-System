import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Action } from 'rxjs/internal/scheduler/Action';
import { CustomerService } from 'src/app/services/customer.service';

import { GlobalConstraints } from 'src/shared/global-constraints';
import jwt_decode from 'jwt-decode';

declare var window: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  formLog: any;
  sign: any;

  forgForm: any = FormGroup;
  formFog: any = FormGroup;

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.customerService.checkToken().subscribe(
        (response: any) => {
          this.router.navigate(['full/das']);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }

    this.sign = new window.bootstrap.Modal(document.getElementById('signForm'));

    this.formLog = new window.bootstrap.Modal(
      document.getElementById('logForm')
    );

    this.formFog = new window.bootstrap.Modal(
      document.getElementById('forgot')
    );
    this.forgForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstraints.nameRegex)],
      ],
    });
  }

  openSignup() {
    this.sign.show();
  }
  closeSignup() {
    this.sign.hide();
  }
  openLogin() {
    this.formLog.show();
  }
  closeLogin() {
    this.formLog.hide();
  }
  openForg() {
    this.formFog.show();
    this.closeLogin();
  }
  closeForg() {
    this.formFog.hide();
  }

  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}

  onSubmitSign(signData: NgForm) {
    var DataSign = signData.value;
    var data = {
      name: DataSign.name,
      email: DataSign.email,
      phoneNumber: DataSign.phoneNumber,
      password: DataSign.password,
    };
    const confirmPassword = document.getElementById(
      'confirmpassword'
    ) as HTMLInputElement;

    if (confirmPassword.value == data.password) {
      this.customerService.signup(data).subscribe(
        (response: any) => {
          this.router.navigate(['/']);
          this.responseMessage = response?.message;
          this.sign.hide();
          this.formLog.show();
          this.toastr.success(
            'Successfully created account. Please Login!',
            '',
            {
              positionClass: 'toast-top-center',
            }
          );
        },
        (error) => {
          this.toastr.error(
            'Something Wrong.Please check the details again..',
            '',
            { positionClass: 'toast-top-center' }
          );
        }
      );
    } else {
      this.toastr.error('Please confirm password again..');
    }
  }
  userS = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  onSubmitLog(logForm: NgForm) {
    var logData = logForm.value;
    var data = {
      email: logData.email,
      password: logData.password,
    };
    this.customerService.login(data).subscribe(
      (response: any) => {
        // this.router.navigate(['/full/das']);
        localStorage.setItem('token', response.token);
        // this.responseMessage = response?.message;
        const decode: any = jwt_decode(response.token);
        const userInfo = {
          name: decode.name,
          email: decode.email,
          role: decode.role,
        };

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.toastr.success('Login Successfully!', 'Success', {
          positionClass: 'toast-top-center',
        });
        this.formLog.hide();
        if (decode.role === 'admin') {
          this.router.navigate(['/full/das']);
        } else {
          this.router.navigate(['/customer']);
        }
      },
      (error) => {
        this.toastr.error(
          'Something Wrong.Please check the Email and password',
          '',
          { positionClass: 'toast-top-center' }
        );
        this.toastr.info('Please wait for addmin approval', '', {
          positionClass: 'toast-top-center',
        });
      }
    );
  }

  sendMail() {
    var forgData = this.forgForm.value;
    var data = {
      email: forgData.email,
    };
    this.customerService.forgP(data).subscribe(
      (response: any) => {
        this.router.navigate(['/']);
        this.responseMessage = response?.message;
        this.toastr.success(
          'Successfully send the password to yout email',
          '',
          { positionClass: 'toast-top-center' }
        );
      },
      (error) => {
        this.toastr.error('Please Check Email Address again', '', {
          positionClass: 'toast-top-center',
        });
      }
    );
  }
}
