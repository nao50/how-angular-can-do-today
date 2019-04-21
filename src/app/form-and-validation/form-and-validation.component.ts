import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

export interface Product {
  productName: string;
  productCode: string;
  price: number;
  maxQuantity: number;
}
export interface Products {
  product: Product;
  productNumber: number;
}
export interface Order {
  products: Products[];
  options: SpecialOptions;
}
export interface SpecialOptions {
  op: string;
}

export interface Receipt {
  productName: string;
  unitPrice: number;
  productNumber: number;
  subTotal: number;
}

@Component({
  selector: 'app-form-and-validation',
  templateUrl: './form-and-validation.component.html',
  styleUrls: ['./form-and-validation.component.scss']
})
export class FormAndValidationComponent implements OnInit {
  Total: number;
  unitPrice: number;
  product: Product;
  sampleProducts: Product[] = [
    {productName: 'Apple', productCode: 'p001', price: 100, maxQuantity: 10},
    {productName: 'Orange', productCode: 'p002', price: 80, maxQuantity: 15},
    {productName: 'Banana', productCode: 'p003', price: 60, maxQuantity: 5},
    {productName: 'Pineapple', productCode: 'p004', price: 500, maxQuantity: 3},
  ];
  displayRemoveIcon = false;

  displayedColumns: string[] = ['Product', 'Unitprice', 'Number', 'Subtotal'];
  receipt: Receipt[] = [
    {productName: 'Apple', unitPrice: 100, productNumber: 5, subTotal: 500},
    {productName: 'Orange', unitPrice: 80, productNumber: 2, subTotal: 160},
    {productName: 'Pineapple', unitPrice: 500, productNumber: 3, subTotal: 1500},
  ];



  productFormGroup = this.formBuilder.group({
    products: this.formBuilder.array([
      this.formBuilder.group({
        product: [this.product],
        productNumber: [1, [Validators.min(1)]],
      })
    ])
  });

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.formSubscribe();
  }

  formSubscribe() {
    this.productFormGroup.valueChanges.subscribe(
      (value: Order) => {
        this.calculate(value);
        if (this.products.length === 1) {
          this.displayRemoveIcon = false;
        } else {
          this.displayRemoveIcon = true;
        }

        if (this.productFormGroup.status === 'INVALID') {
          console.log('INVALID');
        } else if ( this.productFormGroup.status === 'VALID') {
          console.log('VALID');
        }
      }
    );
  }

  get products(): FormArray {
    return this.productFormGroup.get('products') as FormArray;
  }

  addInput() {
    this.products.push(this.formBuilder.group({
      product: [''],
      productNumber: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  delInput(index) {
    this.products.removeAt(index);
  }

  resetForm() {
    this.productFormGroup.reset();
  }

  displayFn(product: Product) {
    if (product) { return product.productName; }
  }

  getUnitPrice(index: number) {
    this.unitPrice = 0;
    if (this.products.controls[index]['controls'].product.value) {
      return this.products.controls[index]['controls'].product.value.price;
    }
  }

  getSelectedProduct(index: number) {
    if (this.products.controls[index]['controls'].product.value) {
      return this.products.controls[index]['controls'].product.value.productName;
    }
  }
  delSelectedProduct(index: number) {
    if (this.products.controls[index]['controls'].product.value) {
      this.products.controls[index].patchValue({ product: '', productNumber: 1}, {emitEvent: true});
    }
  }

  calculate(order?: Order) {
    // calculate Total
    this.Total = 0;
    for (let i = 0; i < order.products.length; i++) {
      if (order.products[i].product) {
        this.Total += (order.products[i].product.price * order.products[i].productNumber);
      }
    }

    // calculate Receipt
    const arr = [];
    for (let i = 0; i < order.products.length; i++) {
      if (order.products[i].product) {
        arr.push(order.products[i]);
      }
    }

    const map2 = new Map;
    const receipt = [];

    arr.reduce(function(map, current) {
      // const productName = current.product.productName;
      // map.set(productName, map.has(productName) ? map.get(productName) + current.productNumber : current.productNumber);
      map.set(current.product, map.has(current.product) ? map.get(current.product) + current.productNumber : current.productNumber);
      return map;
    }, map2).forEach(function (value, key, map) {
      this.push({product: key, productNumber: value});
    }, receipt);

    console.log('receipt: ', receipt);

  }

  save() {
    // localStorage.setItem('howAngularForm', token);
    const message = 'message';
    const action = 'action';
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getTotalCost() {
    // return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
    return this.receipt.map(t => t.subTotal).reduce((acc, value) => acc + value, 0);
  }

  getProductNumberErrorMessage(index: number) {
    // if (this.products.controls[index]['controls'].product.value) {
    //   console.log('ABC: ', this.products.controls[index]['controls'].product.value.price);
    // }

    // return (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('maxQuantity') ? '1度に発注できる最大件数を超えています' :
    //   (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('integer') ? '個数を入力してください' :
    //   (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('required') ? '個数を入力してください' :
    //   '' ;
  }

}
