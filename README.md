# IFQ636 Assignment 1

## Parallel worktree dev ports

`pnpm dev` reads `.env`, generates the nginx config for the current worktree,
starts that worktree's Docker Compose project, and then starts the storefront,
admin, and backend dev servers.

The Vite dev commands are plain `vite`; the ports are controlled in the Vite
configs from these same env values. That keeps nginx and Vite pointed at the
same ports.

Keep existing shared service values, such as the cloud `MONGODB_URI`, unchanged;
only the local ports and Compose project name need to differ per worktree.

Use these values in the primary checkout's `.env`:

```env
COMPOSE_PROJECT_NAME=ifq683-a1
NGINX_PORT=80
BACKEND_PORT=5102
STOREFRONT_PORT=5173
ADMIN_PORT=5174
CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost,http://otbtstore.localhost
VITE_STOREFRONT_API_BASE_URL=/api/storefront
VITE_ADMIN_API_BASE_URL=/api/admin
VITE_ALLOWED_HOSTS=localhost,otbtstore.localhost
```

Use unique values in each extra worktree's `.env` when running more than one
copy at the same time:

```env
COMPOSE_PROJECT_NAME=ifq683-a1-extra
NGINX_PORT=8180
BACKEND_PORT=5302
STOREFRONT_PORT=5373
ADMIN_PORT=5374
CLIENT_ORIGINS=http://localhost:5373,http://localhost:5374,http://localhost:8180
VITE_STOREFRONT_API_BASE_URL=/api/storefront
VITE_ADMIN_API_BASE_URL=/api/admin
VITE_ALLOWED_HOSTS=localhost,otbtstore.localhost
```
