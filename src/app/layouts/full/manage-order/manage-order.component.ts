import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillService } from 'src/app/services/bill.service';
import { ManageCategoryService } from 'src/app/services/manage-category.service';
import { ProductsService } from 'src/app/services/products.service';
import { GlobalConstraints } from 'src/shared/global-constraints';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.css', '../../../../shared/button.css'],
})
export class ManageOrderComponent implements OnInit {
  // Add to bill
  @ViewChild('tableBody') tableBody!: ElementRef;
  //

  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  manageCustomerForm: any = FormGroup;
  categorys: any = [];
  products: any = [];
  price: any = [];
  totalAmount: number = 0;
  responseMessage: any;
  data: any;
  productsName: any;
  billItems: any = [];

  //---chatGPT---//
  categories: any = [];
  selectedProductPrice: number = 0;
  selectedCategory: any = {};
  selectedProduct: any = {};

  constructor(
    private manageCategory: ManageCategoryService,
    private product: ProductsService,
    private toastr: ToastrService,
    private bill: BillService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategory() {
    this.manageCategory.categoryDetails().subscribe(
      (response: any) => {
        this.categorys = response;
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstraints.genericError;
        }
      }
    );
  }

  //--------//
  getCategories() {
    this.product.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  getProductsByCategoryId(categoryId: number) {
    this.product.getProductsByCategoryId(categoryId).subscribe((data) => {
      this.products = data;
    });
  }
  selectedCategoryName: any;
  onSelectCategory(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.selectedCategoryName = selectedOption.textContent?.trim() ?? '';

    const categoryID = (event.target as HTMLSelectElement)?.value;
    if (categoryID) {
      this.product.getProductsByCategory(categoryID).subscribe((products) => {
        this.products = products;
      });
    }
    return this.selectedCategoryName;
  }

  selectedProductName: any;
  onSelectPrice(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedOption = target.options[target.selectedIndex];
    this.selectedProductName = selectedOption.textContent?.trim() ?? '';

    const id = (event.target as HTMLSelectElement)?.value;

    if (id) {
      this.product.getById(id).subscribe((price) => {
        this.price = price;
      });
    }
    return this.selectedProductName;
  }

  //set total = price * qty

  totalPrice(event: Event) {
    const price = document.getElementById('priceInput') as HTMLInputElement;

    const qty = document.getElementById('quanitityInput') as HTMLInputElement;

    const total = Number(price.value) * Number(qty.value);
    const totalInput = document.getElementById(
      'totalInput'
    ) as HTMLInputElement;
    // set value as price*qty
    totalInput.value = total.toString();
  }
  // clear order details

  clearOrderDetails() {
    // Get the form element
    const form = document.getElementById('orderDetails') as HTMLFormElement;
    if (form != null) {
      // Loop through the form's input fields and clear their values
      for (let i = 0; i < form.elements.length; i++) {
        const field = form.elements[i] as HTMLInputElement;
        if (field.type !== 'button' && field.type !== 'submit') {
          field.value = '';
        }
      }
    }
  }

  // Generate Bill

  submit() {
    // get acces to customer details
    const name = document.getElementById('nameInput') as HTMLInputElement;

    const email = document.getElementById('emailInput') as HTMLInputElement;

    const phoneNumber = document.getElementById(
      'phoneInput'
    ) as HTMLInputElement;

    const paymentMethod = document.getElementById(
      'paymentInput'
    ) as HTMLInputElement;
    // get value from bill table
    const rows = document.querySelectorAll('#body tr');
    const data: any[] = [];
    let totalAmount = 0;
    rows.forEach((row) => {
      const cells = (<HTMLTableRowElement>row).cells;
      const proN = cells[0].textContent || '';
      const catN = cells[1].textContent || '';
      const qty = cells[2].textContent || '';
      const priceBText = cells[3].textContent;
      const priceB = priceBText !== null ? parseFloat(priceBText) : 0;
      const totalBText = cells[4].textContent!;
      const totalB = parseFloat(totalBText);

      const rowObj = {
        name: proN,
        price: priceB,
        total: totalB,
        category: catN,
        quantity: qty,
      };

      data.push(rowObj);
      totalAmount += totalB;
      console.log(totalAmount);
      console.log(rowObj);
    });
    const productsDetails = JSON.stringify(data);

    var orderDetailsObject = {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      paymentMethod: paymentMethod.value,
      totalAmount,
      productsDetails,
    };
    console.log(orderDetailsObject);
    if (
      orderDetailsObject.name &&
      orderDetailsObject.email &&
      orderDetailsObject.phoneNumber &&
      orderDetailsObject.paymentMethod != '' &&
      orderDetailsObject.productsDetails != '[]'
    ) {
      this.bill.generateReport(orderDetailsObject).subscribe(
        (response: any) => {
          this.toastr.success('Successfull submitted');
        },
        (error) => {
          this.toastr.error('Something went wrong. Please try again');
        }
      );
    } else
      [
        this.toastr.warning(
          'Please fill all the field correctly before submit.'
        ),
      ];
  }

  // Add to bill
  addBill: any;
  addToBill() {
    const Quantity = document.getElementById(
      'quanitityInput'
    ) as HTMLInputElement;
    const price = document.getElementById('priceInput') as HTMLInputElement;
    const total = document.getElementById('totalInput') as HTMLInputElement;
    this.addBill = {
      proN: this.selectedProductName,
      catN: this.selectedCategoryName,
      qty: Quantity.value,
      priceB: price.value,
      totalB: total.value,
    };

    if (
      this.addBill.proN != undefined &&
      this.addBill.catN != undefined &&
      this.addBill.qty &&
      this.addBill.priceB &&
      this.addBill.totalB != ''
    ) {
      const newRow = this.tableBody.nativeElement.insertRow();
      newRow.insertCell().textContent = this.addBill.proN;
      newRow.insertCell().textContent = this.addBill.catN;
      newRow.insertCell().textContent = this.addBill.qty;
      newRow.insertCell().textContent = this.addBill.priceB;
      newRow.insertCell().textContent = this.addBill.totalB;
      this.toastr.success('Successfull Added to Bill');
      this.clearOrderDetails();
    } else {
      this.toastr.error('Please add correct order details');
    }
  }
}
