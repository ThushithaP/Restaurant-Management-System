import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}
  // --Product Details ---//
  productDetails() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl + '/products/details', { headers });
  }
  // ---Add Product-----//
  addProduct(product: {
    name: any;
    categoryID: any;
    description: any;
    price: any;
    photo: any;
  }) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('categoryID', product.categoryID);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('photo', product.photo, product.photo.name);

    return this.http.post<any>(`${this.apiUrl}/products/add`, formData, {
      headers,
    });
  }
  // ---Delete Product---//
  deleteProduct(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiUrl + '/products/delete', {
      headers,
      body: data,
    });
  }
  // -----Update Product---//
  updateProduct(product: {
    name: any;
    categoryID: any;
    description: any;
    price: any;
    photo: any;
    id: any;
  }) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('categoryID', product.categoryID);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('photo', product.photo, product.photo.name);
    formData.append('id', product.id);
    console.log(product.photo.name);
    return this.http.put<any>(`${this.apiUrl}/products/update`, formData);
  }

  //---for manage order----//
  pname() {
    return this.http.get(this.apiUrl + '/products/pname');
  }

  getProductsByCategory(id: any) {
    return this.http.get(this.apiUrl + '/products/getByCategory/' + id);
  }

  getById(id: any) {
    return this.http.get(this.apiUrl + '/products/getById/' + id);
  }

  //------//
  getCategories() {
    return this.http.get(`${this.apiUrl}/category/details`);
  }

  getProductsByCategoryId(categoryId: any) {
    return this.http.get(`${this.apiUrl}/products/gg/${categoryId}`);
  }

  //---Display produt card----//

  AllProducts(data: any) {
    return this.http.get(this.apiUrl + '/products/showCategoryWise', {
      params: data,
    });
  }

  // --product Available---//

  productAvailable(avail: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(this.apiUrl + '/products/status', avail, {
      headers,
    });
  }

  // ---product Not Available------//
  productNotAvailable(id: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(
      this.apiUrl + `/products/statusN/${id}`,
      { status: 'Not Available' },
      {
        headers,
      }
    );
  }

  // update Image
  updateImage(image: { photo: any }, id: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('photo', image.photo, image.photo.name);

    return this.http.patch<any>(`${this.apiUrl}/products/image`, formData, {
      headers,
    });
  }

  // update Price
  updatePrice(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/products/price`, data, {
      headers,
    });
  }
}
