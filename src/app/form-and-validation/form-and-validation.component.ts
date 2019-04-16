import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';

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
  options: AdditionalOptions;
}
export interface AdditionalOptions {
  p: string;
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
  ) { }

  ngOnInit() {
    this.formSubscribe();
  }

  formSubscribe() {
    this.productFormGroup.valueChanges.subscribe(
      (value: Order) => {
        this.calculate(value);
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
    for (let i = 0; i < this.sampleProducts.length; i++) {
      arr.push(this.sampleProducts[i].productName);
    }

    const productNameList = arr.filter((x, i, self) => self.indexOf(x) === i);
    // console.log(productNameList);
  }

  getProductNumberErrorMessage(index: number) {
    // if (this.products.controls[index]['controls'].product.value) {
    //   console.log('ABC: ', this.products.controls[index]['controls'].product.value.price);
    // }
    return (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('maxQuantity') ? '1度に発注できる最大件数を超えています' :
      (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('integer') ? '個数を入力してください' :
      (<FormArray>this.productFormGroup.get('products')).controls[index]['controls'].productNumber.hasError('required') ? '個数を入力してください' :
      '' ;
  }

}
