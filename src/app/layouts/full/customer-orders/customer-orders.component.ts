import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare let window: any;

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css'],
})
export class CustomerOrdersComponent {
  view: any;
  data: any;
  na: any;
  qan: any;
  customersOrder: any;
  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.customerOrders();

    this.view = new window.bootstrap.Modal(
      document.getElementById('vieworder')
    );
  }

  // get order details from cart

  customerOrders() {
    this.cartService.getCartOrderDetails().subscribe((response: any) => {
      this.customersOrder = response;
    });
  }

  openViewOrder() {
    this.view.show();
  }

  viewtable(dateUser: string) {
    const orderBody = document.getElementById('cart-body');
    // let i = 0;
    // for (i = 0; i < this.customersOrder.length; i++) {
    //   const order = this.customersOrder[i];

    //   const cartList = JSON.parse(order.cartList);

    //   let j = 0;
    //   for (j = 0; j < cartList.length; j++) {
    //     const list = cartList[j];

    //     const name = list.name;
    //     const qty = list.qty;

    //     let newrow = document.createElement('tr');
    //     let namecells = document.createElement('td');
    //     namecells.innerText = name;
    //     newrow.appendChild(namecells);
    //     let qtycells = document.createElement('td');
    //     qtycells.innerText = qty;
    //     newrow.appendChild(qtycells);

    //     orderBody?.appendChild(newrow);
    //   }
    // }
    this.customersOrder = this.customersOrder.filter(
      (cus: any) => cus.dateUser == dateUser
    );
    // console.log(this.customersOrder);
    let i = 0;
    this.na = '';
    this.qan = '';
    for (i = 0; i < this.customersOrder.length; i++) {
      const order = this.customersOrder[i];

      const cartList = JSON.parse(order.cartList);

      let j = 0;
      for (j = 0; j < cartList.length; j++) {
        const list = cartList[j];

        const name = list.name;
        const qty = list.qty;
        console.log(name);
        console.log(qty);
        if (name) {
          // check if name is defined before concatenating
          this.na += name + '<br>'; // add a line break after each name
        }
        if (qty) {
          // check if name is defined before concatenating
          this.qan += qty + '<br>'; // add a line break after each name
        }
        console.log(this.na);

        const nametd = document.getElementById('nameT');
        if (nametd) {
          nametd.innerHTML = this.na;
        }
        const qtytd = document.getElementById('qtyT');
        if (qtytd) {
          qtytd.innerHTML = this.qan;
        }
      }
    }
  }

  // delete order
  deleteOrder(id: any) {
    console.log(id);
    this.cartService.deleteOrder(id).subscribe(
      (response: any) => {
        this.toastr.warning('Delete Order');
        this.customerOrders();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // To delivery button

  delivery(event: Event, id: any) {
    const delivery = event.target as HTMLInputElement;
    const confirmed = confirm(
      'Are you sure you want to mark this order as delivered?..If you click OK, it cannot be changed again.Note that delivered orders will disappear from this table.'
    );
    if (confirmed) {
      if (delivery.checked) {
        this.cartService
          .confirmDelivery((this.data = { id: id, status: 'Delivered' }))
          .subscribe((response: any) => {
            this.toastr.info('Order Delivered Succesfull');
            this.customerOrders();
          });
      } else {
        console.log(id);
      }
    } else {
      delivery.checked = false;
    }
  }
}
