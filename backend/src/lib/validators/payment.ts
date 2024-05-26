import { number, object, TypeOf } from "zod";

export const createPaymentValidator = object({
  body: object({
    creditsAmount: number({
      required_error: "Credits Amount is required.",
    }),
  }),
});

export type createPaymentRequest = TypeOf<typeof createPaymentValidator>;
