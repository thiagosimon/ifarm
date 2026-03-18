# Rollback Procedure

## Quick Rollback

```bash
# Rollback to previous revision
kubectl rollout undo deployment/{service} -n ifarm-prod
kubectl rollout status deployment/{service} -n ifarm-prod --timeout=300s

# Verify
curl -f https://api.ifarm.com.br/health
```

## Rollback to Specific Version

```bash
# List available revisions
kubectl rollout history deployment/{service} -n ifarm-prod

# Rollback to specific revision
kubectl rollout undo deployment/{service} -n ifarm-prod --to-revision={N}
```

## Communication

- Notify #engineering in Slack
- Update status page if user-facing
- Create incident ticket
