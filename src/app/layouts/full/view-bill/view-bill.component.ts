import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';

declare var window: any;
@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css'],
})
export class ViewBillComponent {
  data: any;

  constructor(private bill: BillService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.getViewBillDetails();
  }

  getViewBillDetails() {
    this.bill.billDetails().subscribe((response: any) => {
      this.data = response;
    });
  }
  downloadBill() {
    this.toastr.info('Bill dowloading...');
  }
  deleteBill(id: any) {
    this.bill.deleteBill(id).subscribe((response: any) => {
      this.toastr.success('Successfully deleted the bill');
      this.getViewBillDetails();
    });
  }
}
