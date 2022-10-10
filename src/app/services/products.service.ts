import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { checkTime } from '../interceptors/time.interceptor';

import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from './../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiURL = 'https://young-sands-07814.herokuapp.com/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit != undefined && offset != undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http
      .get<Product[]>(this.apiURL, { params, context: checkTime() })
      .pipe(
        retry(3),
        map((products) =>
          products.map((item) => {
            return {
              ...item,
              taxes: 0.12 * item.price,
            };
          })
        )
      );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(this.getProduct(id), this.update(id, dto));
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiURL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('falló el server :c');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('no estas autorizado');
        }
        return throwError('Ups algo salio mal');
      })
    );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiURL}`, {
      params: { limit, offset },
    });
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiURL, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiURL}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiURL}/${id}`);
  }
}
