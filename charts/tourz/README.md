# Tourz Helm chart

Deploys the Next.js app as a non-root container with a Service, startup/readiness/liveness probes, and optional Ingress/TLS. The database remains external; this chart does not run migrations.

## 1. Build and push the image

Run from the repository root with Docker installed. Replace the registry, project URL, and **public publishable** key below. Authenticate to your container registry first.

```sh
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key \
  -t registry.example.com/your-team/tourz:0.1.0 .
docker push registry.example.com/your-team/tourz:0.1.0
```

Build for your Kubernetes nodes' architecture (for example, add `--platform linux/amd64` when needed). Use a new immutable image tag for each release.

The Docker build excludes local `.env` files. All `NEXT_PUBLIC_*` values are embedded at build time; changing Helm environment values cannot update them. Rebuild for a different backend, map configuration, or feature flags. The Dockerfile accepts every public variable in `.env.example` as a build argument and uses its map/feature defaults. Never supply private/service-role keys as build arguments.

## 2. Configure and deploy

Requires Helm 3+, Kubernetes 1.23+, a configured cluster context, and registry access from the cluster. Copy the example to a values file of your choice, replacing the image repository/tag. Enable ingress only after setting a real hostname and an installed ingress class.

```sh
helm lint charts/tourz
helm template tourz charts/tourz -f charts/tourz/values.example.yaml
helm upgrade --install tourz charts/tourz \
  --namespace tourz --create-namespace \
  -f charts/tourz/values.example.yaml \
  --wait --timeout 5m
kubectl --namespace tourz port-forward service/tourz 3000:80
```

Open http://localhost:3000. `/healthz` returns `{"status":"ok"}` without authentication or a database call. It checks whether the app can serve requests; it does not verify database availability.

For private registries, create a registry pull Secret in the same namespace and reference it through `imagePullSecrets`. For server-only secrets, reference an existing Secret through `envFrom`; do not put secret values in Helm values files. Changes to external Secrets/ConfigMaps require a rollout restart to refresh container environment variables.

## Common settings

| Value | Purpose |
| --- | --- |
| `image.repository`, `image.tag` | Image built and pushed above |
| `imagePullSecrets` | Existing registry credentials |
| `replicaCount` | Defaults to one replica |
| `service.type`, `service.port` | Defaults to ClusterIP on port 80, targeting container port 3000 |
| `ingress.enabled`, `ingress.className`, `ingress.hosts`, `ingress.tls` | Optional routing and existing TLS Secret; requires an ingress controller |
| `env`, `envFrom` | Server-only environment configuration; PORT and HOSTNAME are reserved |
| `resources` | CPU/memory requests and memory limit; tune to measured load |
| `nodeSelector`, `tolerations`, `affinity` | Scheduling preferences |

The container runs as UID/GID 1000 and needs a writable filesystem for the Next.js cache. Cache contents are ephemeral. Before scaling beyond one replica, configure shared cache/revalidation coordination and consistent Server Action encryption keys as described in Next.js self-hosting guidance; use the same build across replicas. Also review [the app's consistency policy](../../docs/consistency.md).

## Validate and package

```sh
helm lint charts/tourz --strict
helm template tourz charts/tourz -f charts/tourz/values.example.yaml
helm package charts/tourz --destination /tmp
```

Chart structure follows the [Helm chart best practices](https://docs.helm.sh/docs/chart_best_practices/).
