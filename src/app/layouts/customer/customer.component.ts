import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import jwtDecode from 'jwt-decode';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

declare var window: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css', '../../../shared/button.css'],
})
export class CustomerComponent implements OnInit {
  @ViewChild('row') row!: ElementRef;
  @ViewChild('rowCst') rowCst!: ElementRef;
  @ViewChild('rownum') rownum!: ElementRef;
  product = {
    name: '',
    categoryID: '',
    description: '',
    price: 0,
    photo: null,
  };
  decodedToken: any = jwtDecode(localStorage.getItem('token') || '');
  user: any;
  data: any;
  cartItems: any = [];

  orders: any;

  constructor(
    private productService: ProductsService,
    private cartServise: CartService,

    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.AllDetails();
    this.orderDetails();
  }
  // product details for card
  biriyaniDetails() {
    var data = {
      category: 'biriyani',
    };
    this.productService.AllProducts(data).subscribe((response: any) => {
      this.data = response;
    });
  }
  breadDetails() {
    var data = {
      category: 'bread',
    };
    this.productService.AllProducts(data).subscribe((response: any) => {
      this.data = response;
    });
  }
  softDrinks() {
    var data = {
      category: 'softDrinks',
    };
    this.productService.AllProducts(data).subscribe((response: any) => {
      this.data = response;
    });
  }
  AllDetails() {
    var data = {
      category: 'all',
    };
    this.productService.AllProducts(data).subscribe((response: any) => {
      this.data = response;
    });
  }
  // cart
  addToCart(item: any) {
    let found = false;

    this.cartItems.forEach((cartItem: any) => {
      if (cartItem.id === item.id) {
        // cartItem.qty++;
        found = true;
        this.toastr.info('Already existing in the cart');
      }
    });
    if (!found) {
      this.cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: 0,
      });

      this.toastr.success('Added to cart', '', {
        positionClass: 'toast-top-center',
      });
    }
  }
  deleteItemIncart(id: number) {
    this.cartItems = this.cartItems.filter(
      (cartItem: any) => cartItem.id !== id
    );
  }

  multiply(event: Event, item: any) {
    const itmQty = event.target as HTMLInputElement;
    item.totalPrice = item.price * parseInt(itmQty.value);
    if (Number.isNaN(item.totalPrice)) {
      item.totalPrice = item.price;
    }
  }

  getTotalPrice() {
    let total = 0;
    for (let item of this.cartItems) {
      total += item.totalPrice;
    }
    if (Number.isNaN(total)) {
      total = 0;
    }
    return total;
  }
  // ----------CART-----------------------------------------------//

  // -----submit----//
  submitCart() {
    const cartData: any[] = [];
    // user details
    let userDetails: { name: any } = { name: '' };
    const userDe = localStorage.getItem('userInfo');
    if (userDe !== null) {
      userDetails = JSON.parse(userDe);
    }
    let Address: string = '';
    let contactNumber: string = '';
    // user Adress
    const userCartAdress = document.querySelectorAll('#rowCst');
    userCartAdress.forEach((userDataAdress) => {
      const cells = (<HTMLTableRowElement>userDataAdress).cells;
      Address = (cells[0].querySelector('textarea') as HTMLTextAreaElement)
        .value;
    });
    // user Number
    const useCartNumber = document.querySelectorAll('#rownum');
    useCartNumber.forEach((userDataNum) => {
      const cells = (<HTMLTableRowElement>userDataNum).cells;
      contactNumber = (
        cells[0].querySelector('input[type=text]') as HTMLInputElement
      ).value;
    });
    // cart Details
    const rowCart = document.querySelectorAll('#row');
    rowCart.forEach((rowData) => {
      const cells = (<HTMLTableRowElement>rowData).cells;
      const productNameCart = cells[0].textContent;
      const productQtyCart = (
        cells[1].querySelector('input[type=number]') as HTMLInputElement
      ).value;
      const productPriceCart = cells[2].textContent;

      const cartDetails = {
        name: productNameCart,
        qty: productQtyCart,
        price: productPriceCart,
      };
      cartData.push(cartDetails);
    });
    const cartList = JSON.stringify(cartData);
    //again calculate total for pass details
    let total = 0;
    for (let item of this.cartItems) {
      total += item.totalPrice;
      if (Number.isNaN(total)) {
        total = 0;
      }
    }
    // Date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    // const hours = String(now.getHours()).padStart(2, '0');
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const DateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const cartObj = {
      dateUser: DateTime,
      nameUser: userDetails.name,
      addressUser: Address,
      numberUser: contactNumber,
      cartList,
      total,
    };
    cartObj.cartList = cartList;

    this.cartServise.submitCartOrder(cartObj).subscribe(
      (respnse: any) => {
        this.toastr.success('Order Submitted.. Enjoyy');
      },
      (error) => {
        this.toastr.error('Something went wrong.. Please try agin');
      }
    );
  }

  orderItems: any[] = [];
  orderDetails() {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodedToken = jwt_decode(token);
      this.user = {
        name: this.decodedToken.name,
      };
    }
    var data = {
      nameUser: this.user.name,
    };

    this.cartServise.myorder(data).subscribe((response: any) => {
      this.orders = response;

      const order = this.orders[0];
      const cart = JSON.parse(order.cartList);
      this.orderItems = cart.map(
        (item: { name: any; qty: any; price: any }) => {
          return {
            name: item.name,
            qty: item.qty,
            price: item.price,
          };
        }
      );
    });
  }
}
