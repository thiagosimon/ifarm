# RabbitMQ Recovery

## Detection

- Services unable to publish/consume events
- RabbitMQ pod not running

## Steps

1. Check pod status: `kubectl get pods -n ifarm-infra | grep rabbitmq`
2. If pod crashed: check PVC storage, verify data integrity
3. Restart: `kubectl delete pod rabbitmq-0 -n ifarm-infra`
4. Verify all queues restored: access Management UI
5. Check DLQ for any messages lost during downtime
6. Monitor consumer lag returning to normal
