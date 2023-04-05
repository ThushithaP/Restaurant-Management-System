import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css', '../../../../shared/button.css'],
})
export class ProductsComponent implements OnInit {
  selectedFile: File = new File([], '');
  st: any;
  data: any;
  description: any;
  formAddPro: any;
  formDeletePro: any;
  formUpdatePro: any;
  Updateimage: any;
  updateprice: any;
  deleteProductForm: any = FormBuilder;
  updateProductForm: any = FormBuilder;

  prod: any;
  imageUrl: SafeUrl[] = [];
  imageFile: any;
  image = {
    photo: null,
  };

  product = {
    name: '',
    categoryID: '',
    description: '',
    price: 0,
    photo: null,
    id: '',
  };
  currentProductId: any;
  imageSelected: boolean = false;
  photoSubmit: boolean = false;
  priceSelect: boolean = false;

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.getProductsDetails();

    this.formAddPro = new window.bootstrap.Modal(
      document.getElementById('productForm')
    );
    this.formDeletePro = new window.bootstrap.Modal(
      document.getElementById('deleteFormPro')
    );
    this.formUpdatePro = new window.bootstrap.Modal(
      document.getElementById('updateFormPro')
    );
    this.Updateimage = new window.bootstrap.Modal(
      document.getElementById('imageForm')
    );
    this.updateprice = new window.bootstrap.Modal(
      document.getElementById('priceForm')
    );

    this.deleteProductForm = this.formBuilder.group({
      id: [null, [Validators.required]],
    });
  }

  openAddProducts() {
    this.formAddPro.show();
  }
  closeAddPro() {
    this.formAddPro.hide();
  }
  openDeletePro() {
    this.formDeletePro.show();
  }
  closeDeletePro() {
    this.formDeletePro.hide();
  }
  openUpdatePro() {
    this.formUpdatePro.show();
  }
  closeUpdatePro() {
    this.formUpdatePro.hide();
  }

  getProductsDetails() {
    this.productService.productDetails().subscribe((response: any) => {
      this.data = response;
    });
  }

  // Add Product Submit
  onSubmit() {
    this.productService.addProduct(this.product).subscribe(
      (response) => {
        this.toastr.success('Product added successfully');
        this.getProductsDetails();
        this.closeAddPro();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Something error');
      }
    );
  }

  // select image for add product
  onFileSelected(event: any) {
    this.product.photo = event.target.files[0];
  }

  // delete product
  deletePro() {
    const deletePro = this.deleteProductForm.value;
    var data = {
      id: deletePro.id,
    };
    this.productService.deleteProduct(data).subscribe((response: any) => {
      this.toastr.success('Successfully deleted Product');
      this.getProductsDetails();
      this.closeDeletePro();
    });
  }

  onSubmitUpdate() {
    this.productService.updateProduct(this.product).subscribe(
      (response) => {
        this.toastr.success('Product update successfully');
        this.getProductsDetails();
        this.closeUpdatePro();
      },
      (error) => {
        console.log(error);
        this.toastr.error('Something error');
      }
    );
  }

  //------------------------------- status change--------------------------//
  status(event: Event, id: any) {
    const status = event.target as HTMLInputElement;
    // available
    if (status.checked) {
      this.productService
        .productAvailable((this.st = { id: id, status: 'Available' }))
        .subscribe((response: any) => {
          this.toastr.success('Product is AVAILABLE');
          this.getProductsDetails();
        });
      // not available
    } else {
      this.productService
        .productAvailable((this.st = { id: id, status: 'Not Available' }))
        .subscribe((response: any) => {
          this.toastr.warning('Product is NOT AVAILABLE');
          this.getProductsDetails();
        });
    }
    // ---------------------------------------------------------------------//
  }
  //-------------------------Update Only Image------------------------------//
  openUpdateImage(id: any) {
    this.Updateimage.show();
    this.currentProductId = id;
  }
  updatephoto() {
    this.photoSubmit = true;
  }
  // select image for update Image
  onImageSelected(event: any) {
    this.imageSelected = event.target.files.length > 0;
    this.image = {
      photo: event.target.files[0],
    };
    this.updateImage(this.currentProductId, this.image);
  }
  // promise
  imageSelectedPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.photoSubmit) {
          clearInterval(interval);

          resolve(this.imageSelectedPromise); // provide a value to resolve the promise
        }
      }, 100);
    });
  }

  // update image
  async updateImage(id: any, image: any) {
    await this.imageSelectedPromise();

    this.productService.updateImage(this.image, id).subscribe(
      (response: any) => {
        this.toastr.success('Image Updated Succesfully');
        this.Updateimage.hide();
        this.clearLastForm();
        this.imageSelected = false;
        this.photoSubmit = false;
        this.getProductsDetails();
      },
      (error) => {
        this.toastr.error('Please try again');
      }
    );
  }
  clearLastForm() {
    const fileInput = document.querySelector(
      '#imageForm input[type="file"]'
    ) as HTMLInputElement;

    this.imageSelected = false;
    this.photoSubmit = false;
    fileInput.value = '';
  }
  // ------------------------------------------------------------------------------//

  // ------------------------------only update price---------------------------------//

  openUpdatePrice(id: any) {
    this.updateprice.show();
    this.currentProductId = id;
  }

  priceSubmit() {
    const priceO = document.getElementById('priceo') as HTMLInputElement;
    const priceG = priceO.value;
    this.priceSelect = true;
    this.submitPriceOnly(this.currentProductId, priceG);
  }
  priceSelectedPromise(): Promise<any> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.priceSelect) {
          clearInterval(interval);

          resolve(this.priceSelectedPromise); // provide a value to resolve the promise
        }
      }, 100);
    });
  }

  async submitPriceOnly(id: any, price: any) {
    await this.priceSelectedPromise();

    var data = {
      id: id,
      price: price,
    };
    this.productService.updatePrice(data).subscribe(
      (response: any) => {
        this.toastr.success('Succesfully Updated the price');
        this.priceSelect = false;

        this.updateprice.hide();
        this.getProductsDetails();
      },
      (error) => {
        this.toastr.error('Something went wrong.. Please try again');
      }
    );
  }
}
