import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var window: any;

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: [
    './manage-customer.component.css',
    '../../../../shared/button.css',
  ],
})
export class ManageCustomerComponent implements OnInit {
  data: any;
  formUpdateStatus: any;
  formDelete: any;
  DeleteForm: any = FormBuilder;
  updateCustomerStatusForm: any = FormBuilder;

  constructor(
    private customer: CustomerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // -----------------
    /*Load Customer Details */
    this.getCustomerDetails();

    /*Identifying Form */
    this.formUpdateStatus = new window.bootstrap.Modal(
      document.getElementById('updateStatus')
    );
    this.formDelete = new window.bootstrap.Modal(
      document.getElementById('cusDelete')
    );

    /*Validation form */
    this.updateCustomerStatusForm = this.formBuilder.group({
      status: [null, [Validators.required]],
      id: [null, [Validators.required]],
    });

    this.DeleteForm = this.formBuilder.group({
      id: [null, [Validators.required]],
    });
  }

  openUpdateStatusForm() {
    this.formUpdateStatus.show();
  }
  closeUpdateStatusForm() {
    this.formUpdateStatus.hide();
  }
  openDelete() {
    this.formDelete.show();
  }
  closeDelete() {
    this.formDelete.hide();
  }

  getCustomerDetails() {
    this.customer.detailsCus().subscribe((response: any) => {
      this.data = response;
    });
  }
  goToCustomer() {
    this.router.navigate(['/customer']);
  }

  updateStatus() {
    var updateStatusForm = this.updateCustomerStatusForm.value;
    var data = {
      status: updateStatusForm.status,
      id: updateStatusForm.id,
    };
    this.customer.updateCus(data).subscribe((response: any) => {
      this.closeUpdateStatusForm();
      this.toastr.success('Customer Status Update successfully');
      this.getCustomerDetails();
    });
  }
  customerStatus(event: Event, id: any) {
    const CustomerStatus = event.target as HTMLInputElement;
    if (CustomerStatus.checked) {
      var dataA = {
        id: id,
        status: 'Active',
      };
      this.customer.updateCus(dataA).subscribe((response: any) => {
        this.toastr.success('Cuustomer is in ACTIVE mood');
        this.getCustomerDetails();
      });
    } else {
      var dataD = {
        id: id,
        status: 'Deactive',
      };
      this.customer.updateCus(dataD).subscribe((response) => {
        this.toastr.info('Customer is in DEACTIVE mood');
        this.getCustomerDetails();
      });
    }
  }

  DeleteCustomer() {
    var formData = this.DeleteForm.value;
    var data = {
      id: formData.id,
    };
    this.customer.deleteCus(data).subscribe(
      (response: any) => {
        this.closeDelete();
        this.toastr.success('Successfully Deleted Customer');
      },
      (error) => {
        this.toastr.error('Something went wrong');
      }
    );
  }
}
