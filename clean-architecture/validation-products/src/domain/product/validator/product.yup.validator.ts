import ValidatorInterface from "../../@shared/validator/validator.interface";
import * as yup from "yup";
import Product from "../entity/product";

export default class ProductYupValidator implements ValidatorInterface<Product> {
  validate(entity: Product): void {
    try {
      yup.object().shape({
        id: yup.string().required("Id is required"),
        name: yup.string().required("Name is required"),
        price: yup.number().min(0, "Price must be greater than zero").required("Price is required"),
      }).validateSync(entity, { abortEarly: false });
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          message: error,
          context: "product",
        });
      });
    }
  }
}