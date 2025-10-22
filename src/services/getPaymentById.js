import { Payment } from "mercadopago";
import mercadopago from "../config/mercadopago.js";


export async function getPaymentById(id) {
    const payment = new Payment(mercadopago);
    return payment.get({ id });
}
