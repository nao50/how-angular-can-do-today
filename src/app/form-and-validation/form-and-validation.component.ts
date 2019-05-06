import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { MatTableDataSource } from '@angular/material';

import { CustomValidator } from './custom-form-validator';

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
}
export interface Cart {
  cartName: string;
  products: Products[];
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
  productsList: Products[] = [];
  sampleProducts: Product[] = [
    {productName: 'Apple', productCode: 'p001', price: 100, maxQuantity: 10},
    {productName: 'Orange', productCode: 'p002', price: 80, maxQuantity: 15},
    {productName: 'Banana', productCode: 'p003', price: 60, maxQuantity: 5},
    {productName: 'Pineapple', productCode: 'p004', price: 500, maxQuantity: 3},
  ];
  displayRemoveIcon = false;
  formInvalid = false;

  displayedColumns: string[] = ['productName', 'price', 'productNumber', 'Subtotal'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data = new MatTableDataSource(this.productsList);

  productFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.productFormGroup = this.formBuilder.group({
      products: this.formBuilder.array([
        this.formBuilder.group({
          product: [this.product, CustomValidator.maxQuantity],
          productNumber: [1, [Validators.min(1), CustomValidator.integer, CustomValidator.maxQuantity]],
        })
      ], [CustomValidator.maxQuantity])
    });
  }

  ngOnInit() {
    this.formSubscribe();
  }

  formSubscribe() {
    this.productFormGroup.valueChanges.subscribe(
      (value: Order) => {
        // console.log('value: ', value);

        if (this.products.length === 1) {
          this.displayRemoveIcon = false;
        } else {
          this.displayRemoveIcon = true;
        }

        if (this.productFormGroup.status === 'INVALID') {
          this.formInvalid = true;
        } else if ( this.productFormGroup.status === 'VALID') {
          this.formInvalid = false;
        }

        this.calculate(value);
      }
    );
  }

  get products(): FormArray {
    return this.productFormGroup.get('products') as FormArray;
  }

  addInput() {
    this.products.push(this.formBuilder.group({
      product: [''],
      productNumber: [1, [Validators.min(1), CustomValidator.integer, CustomValidator.maxQuantity]]
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
    if (!this.formInvalid) {
      for (let i = 0; i < order.products.length; i++) {
        if (order.products[i].product) {
          this.Total += (order.products[i].product.price * order.products[i].productNumber);
        }
      }
    } else {
      this.Total = 0;
    }

    // calculate Receipt
    const arr = [];
    for (let i = 0; i < order.products.length; i++) {
      if (order.products[i].product) {
        arr.push(order.products[i]);
      }
    }
    console.log('arr: ', arr);

    const map2 = new Map;
    this.productsList = [];

    arr.reduce(function(map, current) {
      map.set(current.product, map.has(current.product) ? map.get(current.product) + current.productNumber : current.productNumber);
      return map;
    }, map2).forEach(function (value, key) {
      this.push({product: key, productNumber: value});
    }, this.productsList);

    console.log('this.productsList: ', this.productsList);
    if (!this.formInvalid) {
      this.data = new MatTableDataSource(this.productsList);
    } else {
      this.data = new MatTableDataSource([]);
    }

  }

  save() {
    localStorage.setItem('howAngularForm', JSON.stringify(this.productsList));
    const message = 'success';
    const action = 'save';
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  load() {}

  reset() {
    while (this.products.length !== 0) {
      this.products.removeAt(0);
    }
    this.addInput();
  }

  getTotal() {
    if (!this.formInvalid) {
      return this.productsList.map(t => (t.product.price * t.productNumber)).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  getErrorMessage(index: number) {
    return this.products.controls[index]['controls'].productNumber.hasError('integerInvalid') ? 'Enter an integer value' :
    this.products.controls[index]['controls'].productNumber.hasError('maxQuantityInvalid') ? 'Exceeds the maximum number' :
    '' ;
  }

}
