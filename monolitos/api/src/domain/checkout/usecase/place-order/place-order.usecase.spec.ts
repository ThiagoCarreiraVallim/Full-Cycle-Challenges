import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.usecase.dto";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase test", () => {
  const makeSut = (client?: {}, payment: boolean = false) => {
    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(client),
    } as unknown as ClientAdmFacadeInterface;

    const mockProductFacade = {
      checkStock: jest.fn(({productId}: {productId: string}) => {
        return {
          productId,
          stock: productId === "1" ? 0 : 1,
        }
      }),
    } as unknown as ProductAdmFacadeInterface;

    const mockCatalogFacade = {
      find: jest.fn().mockResolvedValue(undefined),
    } as unknown as StoreCatalogFacadeInterface;

    let mockPaymentFacade: PaymentFacadeInterface;
    if(payment) {
      mockPaymentFacade = {
        process: jest.fn().mockResolvedValue({
          transactionId: "1i",
          orderId: "1",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      } as unknown as PaymentFacadeInterface;
    } else {
      mockPaymentFacade = {
        process: jest.fn().mockResolvedValue({
          transactionId: "1i",
          orderId: "1",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      } as unknown as PaymentFacadeInterface;
    }

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
    } as unknown as CheckoutGateway;

    const mockInvoiceFacade = {
      generateInvoice: jest.fn().mockResolvedValue({ id: "1i" }),
    } as unknown as InvoiceFacadeInterface;

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade,
      mockProductFacade,
      mockCatalogFacade,
      mockCheckoutRepository,
      mockInvoiceFacade,
      mockPaymentFacade,
    );

    return {
      placeOrderUseCase,
      mockProductFacade,
      mockCatalogFacade,
      mockPaymentFacade,
      mockClientFacade,
      mockCheckoutRepository,
      mockInvoiceFacade,
    };
  };
  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an erro when client not found", async () => {
      const { placeOrderUseCase } = makeSut();

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Client not found");
    });

    it("should throw an error when product not found", async () => {
      const { placeOrderUseCase } = makeSut({});

      const mockValidateProducts = jest
      // @ts-ignore
      .spyOn(placeOrderUseCase, "validateProducts")
      // @ts-ignore
      .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("No products selected");
      expect(mockValidateProducts).toBeCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1",
        name: "Client 1",
        document: "00000000000",
        email: "email@email.com",
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "00000000"
      }

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 100,
        }),
        "2": new Product({
          id: new Id("2"),
          name: "Product 2",
          description: "Product 2 description",
          salesPrice: 200,
        })
      };

      it("should not be approved", async () => {
        const { 
          mockPaymentFacade,
          mockClientFacade,
          mockCheckoutRepository,
          mockInvoiceFacade,
          placeOrderUseCase,
        } = makeSut(clientProps, false);
  
        const mockValidateProducts = jest
        // @ts-ignore
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-ignore
        .mockResolvedValue(null);
  
        const mockGetProduct = jest
        // @ts-ignore
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-ignore
        .mockImplementation((productId: keyof typeof products) => Promise.resolve(products[productId]));

        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [
            {
              productId: "2",
            },
          ],
        };

        const output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe(null);
        expect(output.total).toBe(200);
        expect(output.products).toStrictEqual(input.products);
        expect(mockClientFacade.find).toBeCalledTimes(1);
        expect(mockClientFacade.find).toBeCalledWith({ id: input.clientId });
        expect(mockValidateProducts).toBeCalledTimes(1);
        expect(mockValidateProducts).toBeCalledWith(input);
        expect(mockGetProduct).toBeCalledTimes(1);
        expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
        expect(mockPaymentFacade.process).toBeCalledTimes(1);
        expect(mockPaymentFacade.process).toBeCalledWith({
          orderId: output.id,
          amount: output.total,
        });

        expect(mockInvoiceFacade.generateInvoice).toBeCalledTimes(0)
      });

      it("should be approved", async () => {
        const { 
          mockPaymentFacade,
          mockClientFacade,
          mockCheckoutRepository,
          mockInvoiceFacade,
          placeOrderUseCase,
        } = makeSut(clientProps, true);
  
        const mockValidateProducts = jest
        // @ts-ignore
        .spyOn(placeOrderUseCase, "validateProducts")
        // @ts-ignore
        .mockResolvedValue(null);
  
        const mockGetProduct = jest
        // @ts-ignore
        .spyOn(placeOrderUseCase, "getProduct")
        // @ts-ignore
        .mockImplementation((productId: keyof typeof products) => Promise.resolve(products[productId]));

        const input: PlaceOrderInputDto = {
          clientId: "1",
          products: [
            {
              productId: "2",
            },
          ],
        };

        const output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(200);
        expect(output.products).toStrictEqual(input.products);
        expect(mockClientFacade.find).toBeCalledTimes(1);
        expect(mockClientFacade.find).toBeCalledWith({ id: input.clientId });
        expect(mockValidateProducts).toBeCalledTimes(1);
        expect(mockValidateProducts).toBeCalledWith(input);
        expect(mockGetProduct).toBeCalledTimes(1);
        expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
        expect(mockPaymentFacade.process).toBeCalledTimes(1);
        expect(mockPaymentFacade.process).toBeCalledWith({
          orderId: output.id,
          amount: output.total,
        });

        expect(mockInvoiceFacade.generateInvoice).toBeCalledTimes(1)
        expect(mockInvoiceFacade.generateInvoice).toBeCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [
            {
              id: "2",
              name: "Product 2",
              price: 200,
            },
          ],
        });
      });
    });
  });

  describe("validateProducts method", () => {

    it("should throw an error when no products are selected", async () => {
      const { placeOrderUseCase } = makeSut({});

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("No products selected");
    });

    it("should throw an error when a product is not in stock", async () => {
      const { placeOrderUseCase, mockProductFacade } = makeSut({});

      let input: PlaceOrderInputDto = {
        clientId: "1",
        products: [
          {
            productId: "1",
          },
        ],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is not available in stock");

      input = {
        clientId: "1",
        products: [
          {
            productId: "0",
          },
          {
            productId: "1",
          },
        ],
      };
      
      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is not available in stock");
      expect(mockProductFacade.checkStock).toBeCalledTimes(3);

      input = {
        clientId: "1",
        products: [
          {
            productId: "0",
          },
          {
            productId: "1",
          },
          {
            productId: "2",
          },
        ],
      };
      
      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("Product 1 is not available in stock");
      expect(mockProductFacade.checkStock).toBeCalledTimes(6);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when product not found", async () => {
      const { placeOrderUseCase } = makeSut({});

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrowError("Product not found");
    });

    it("should return a product", async () => {
      const { placeOrderUseCase, mockCatalogFacade } = makeSut({});

      const product = {
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      };

      const expectedProduct = new Product({  ...product, id: new Id(product.id)})

      mockCatalogFacade.find = jest.fn().mockResolvedValue(product);

      const result = await placeOrderUseCase["getProduct"]("1");

      expect(result).toStrictEqual(expectedProduct);
      expect(mockCatalogFacade.find).toBeCalledTimes(1);
    });
  });
});