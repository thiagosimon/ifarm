# Payment Stuck

## Detection

- Order stuck in AWAITING_PAYMENT for >2h (PIX) or >3d (boleto)
- Alert: `payment_transactions_total{status="pending"}` not decreasing

## Steps

1. Check Pagar.me dashboard for transaction status
2. Check payment-service logs: `kubectl logs -n ifarm-prod deployment/payment-service --tail=200 | grep {orderId}`
3. Check if webhook was received: search for pagarmeTransactionId in logs

## Resolution

### Webhook not received

- Verify webhook URL is correct in Pagar.me dashboard
- Check if HMAC secret matches
- Manually trigger status check: call Pagar.me GET /orders/{id}
- If paid on Pagar.me but not in our system: manually publish payment.confirmed event

### PIX expired

- Notify farmer via support
- Order remains AWAITING_PAYMENT until cancelled by admin or TTL job

### Pagar.me API down

- Check status.pagar.me
- Wait for recovery, webhook will be retried by Pagar.me
- If prolonged: manual reconciliation needed
