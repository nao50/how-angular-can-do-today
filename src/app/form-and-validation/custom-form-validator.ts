import { FormControl, FormArray, FormGroup } from '@angular/forms';

export class CustomValidator {

    // Validation integer
    public static integer(formControl: FormControl): ValidationResult {
      // console.log('formControl.value: ', formControl.value);
      let notInteger = null;
      const value = String(formControl.value); // toString
      if (value !== null && value !== '' && value !== 'null') {
        notInteger = /^([1-9]\d*|0)$/.test(value);
        if (notInteger) {
          return null;
        }
      }
      return {'integerInvalid': true};
    }

    // Validation maxQuantity
    public static maxQuantity(formControl: FormControl): ValidationResult {
      // console.log('formControl.parent: ', formControl.parent);
      if (formControl.parent) {
        if (formControl.parent.value) {
          if (formControl.parent.value.product && formControl.parent.value.productNumber) {
            if (formControl.parent.value.product.maxQuantity < formControl.parent.value.productNumber) {
              return {'maxQuantityInvalid': true};
            }
          }
        }
      }
      return null;
    }
  }

  export interface ValidationResult {
    [key: string]: boolean;
  }
