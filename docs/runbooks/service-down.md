# Service Down in Production

## Detection

- Alert: ServiceDown in Grafana/PagerDuty
- Source: `up{job="ifarm"} == 0` for 1min

## Immediate Steps

1. Check which service is down: `kubectl get pods -n ifarm-prod | grep -v Running`
2. Check recent logs: `kubectl logs -n ifarm-prod deployment/{service} --tail=100`
3. Check recent deploys: `kubectl rollout history deployment/{service} -n ifarm-prod`
4. Check pod events: `kubectl describe pod {pod-name} -n ifarm-prod`

## Resolution

### If OOMKilled

- Increase memory limit: `kubectl set resources deployment/{service} -n ifarm-prod --limits=memory=1Gi`
- Investigate memory leak in logs

### If CrashLoopBackOff

- Check logs for startup errors
- Verify environment variables: `kubectl get configmap {service}-config -n ifarm-prod -o yaml`
- Verify secrets exist: `kubectl get secret {service}-secrets -n ifarm-prod`

### Rollback

```bash
kubectl rollout undo deployment/{service} -n ifarm-prod
kubectl rollout status deployment/{service} -n ifarm-prod --timeout=180s
```

### Manual Scale

```bash
kubectl scale deployment/{service} -n ifarm-prod --replicas=5
```

## Post-Incident

- Fill incident report
- Update runbook if new failure mode discovered
- Create follow-up tickets
