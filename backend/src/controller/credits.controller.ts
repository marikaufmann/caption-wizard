import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import { findAndUpdateUser, findUser } from "../service/user.service";
import crypto from "crypto";
const LEMON_SQUEEZY_ENDPOINT = "https://api.lemonsqueezy.com/v1";

export const createPaymentIntentHandler = async (req: Request, res: Response) => {
  try {
    const user = await findUser({ _id: req.user._id });

    const creditsAmount = req.body.creditsAmount;

    if (!creditsAmount) {
      return res.status(400).json({ message: "Credits amount is required." });
    }
    let variantId = "";
    switch (creditsAmount) {
      case 50:
        variantId = "389247";
        break;
      case 100:
        variantId = "389281";
        break;
      case 250:
        variantId = "389282";
        break;
      default:
        return res.status(400).json({ message: "Credits amount is invalid." });
    }

    const response = await axios.post(
      `${LEMON_SQUEEZY_ENDPOINT}/checkouts`,
      {
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: user?.email as string,
              name: `${user?.firstName} ${user?.lastName}`,
              custom: {
                user_id: user?._id as string,
                first_name: user?.firstName as string,
                last_name: user?.lastName as string,
                credits_amount: creditsAmount.toString() as string,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMONSQUEEZY_STORE_ID as string,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId as string,
              },
            },
          },
        },
      },
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        },
      }
    );
    return res
      .status(201)
      .json({ checkoutUrl: response.data.data.attributes.url });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export const addCreditsHandler = async (req: Request, res: Response) => {
  try {
    const eventType = req.get("X-Event-Name");
    const body = JSON.parse(req.body);
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SIGNATURE as string;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(hmac.update(req.body).digest("hex"), "utf8");
    const signature = Buffer.from(req.get("X-Signature") || "", "utf8");
    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    if (eventType === "order_created") {
      const userId: string = body.meta.custom_data.user_id;
      const creditsAmount: number = Number(
        body.meta.custom_data.credits_amount
      );
      const name: string = body.data.attributes.user_name;
      const email: string = body.data.attributes.user_email;
      const total: number = body.data.attributes.total / 100;
      const status: string = body.data.attributes.status;
      const receipt: string = body.data.attributes.urls.receipt;
      const refunded: string = body.data.attributes.refunded;
      const createdAt: string = body.data.attributes.created_at;
      const updatedAt: string = body.data.attributes.updated;

      let addCreditsAmount = 0;
      if (status === "paid") {
        addCreditsAmount = Number(creditsAmount);
      }
      await findAndUpdateUser(
        {
          _id: userId,
        },
        {
          $push: {
            payments: [
              {
                userId,
                name,
                creditsAmount,
                email,
                total,
                status,
                receipt,
                refunded,
                createdAt,
                updatedAt,
              },
            ],
          },
          $inc: {
            credits: addCreditsAmount,
          },
        },
        {
          new: true,
        }
      );
    }
    return res.status(200).json({ message: "Webhook received successfully." });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
