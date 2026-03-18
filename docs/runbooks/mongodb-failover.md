# MongoDB Atlas Failover

## Detection

- Connection errors in service logs
- MongoDB Atlas alerts

## Steps

1. Check Atlas dashboard for cluster status
2. Atlas handles failover automatically (usually 10-30s)
3. Verify connection strings use replica set format
4. Services should reconnect automatically via mongoose retry logic

## If Applications Don't Reconnect

```bash
# Restart affected pods
kubectl rollout restart deployment/{service} -n ifarm-prod
```
