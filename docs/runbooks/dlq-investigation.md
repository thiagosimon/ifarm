# DLQ Investigation

## Detection

- Alert: DLQMessages (`rabbitmq_dlq_size > 0`)

## Steps

1. Access RabbitMQ Management UI: http://localhost:15672 (prod: via port-forward)
2. Navigate to Queues -> filter by "dlq."
3. Get message count and inspect payload
4. Determine root cause (consumer crash, validation error, timeout)

## Manual Replay

```bash
# Port-forward RabbitMQ management
kubectl port-forward svc/rabbitmq -n ifarm-infra 15672:15672

# Use rabbitmq CLI to move messages back
rabbitmqadmin get queue=dlq.{queue-name} count=10
# Inspect payloads, fix root cause, then republish
rabbitmqadmin publish exchange={exchange} routing_key={key} payload='{...}'
```

## When to Discard

- Message is corrupted beyond repair
- Event is obsolete (e.g., quote already expired)
- Document discard reason in incident log
