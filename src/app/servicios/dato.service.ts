import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatoService {
  private URL = "http://localhost:8080/api/productos";

  constructor(private httpClient: HttpClient) {}
  


  public getAllProductos(): Observable<any> {
    return this.httpClient.get(this.URL);
  }

  public getProducto(id: any): Observable<any> { 
    return this.httpClient.get(this.URL + "/" + id); 
  }

  public createProducto(productoData: any): Observable<any> { 
    return this.httpClient.post(this.URL, productoData); 
  }

  public deleteProducto(id: any): Observable<any> { 
    return this.httpClient.delete(this.URL + "/" + id); 
  }

  public updateProducto(id: any, productoData: any) { 
    return this.httpClient.put(this.URL + "/" + id, productoData);
  }
}
