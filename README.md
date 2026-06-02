# IFQ636 - Assignment 1
## Order of the Black Thorn - Online Flower Shop

Order of the Black Thorn is an online store for dark floral arrangements, vessels, and keepsakes. It includes a public storefront, customer account and order workflows, and an admin dashboard for managing the catalogue and reviewing orders.

## Project Links

- Public storefront: [http://16.176.211.132/](http://16.176.211.132/)
- Public admin dashboard: [http://16.176.211.132/admin/](http://16.176.211.132/admin/)
- Optional hostname storefront: [http://otbtstore.demo/](http://otbtstore.demo/)
- Optional hostname admin dashboard: [http://otbtstore.demo/admin/](http://otbtstore.demo/admin/)
- GitHub repository: [melchoy/IFQ636-A1](https://github.com/melchoy/IFQ636-A1)
- Jira board: [OTBT project board](https://ifq636-otbt.atlassian.net/jira/software/c/projects/OTBT/list?jql=project%20%3D%20OTBT%20ORDER%20BY%20created%20DESC)
- Figma design: [IFQ636 Assignment 1 design file](https://www.figma.com/design/TFC6WKup4D3rvQQXCrrCRT/IFQ636---Assignment-1?design)
- Figma storefront prototype: [IFQ636 Assignment 1 storefront prototype](https://www.figma.com/proto/TFC6WKup4D3rvQQXCrrCRT/IFQ636---Assignment-1?node-id=1524-162&p=f&t=8tt8PMLbV2vnIjA9-0&scaling=min-zoom&content-scaling=fixed&page-id=1301%3A825&starting-point-node-id=1524%3A162&show-proto-sidebar=1)
- Figma admin prototype: [IFQ636 Assignment 1 admin prototype](https://www.figma.com/proto/TFC6WKup4D3rvQQXCrrCRT/IFQ636---Assignment-1?node-id=874-2&p=f&t=JkDyqNcDAqLQgmsS-0&scaling=min-zoom&content-scaling=fixed&page-id=420%3A35&starting-point-node-id=874%3A2&show-proto-sidebar=1)

## Demo Access

Admin dashboard:

```text
Email: admin@example.com
Password: password
```

Storefront customer accounts can be created from the public storefront. Seeded customer accounts are also available if the deployed database has been seeded:

```text
Email: customer@example.com
Password: password
```

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Fill the required values in `.env`:

```text
MONGODB_URI
ADMIN_JWT_SECRET
STRIPE_SECRET_KEY
```

Start the local application:

```bash
pnpm dev
```

Default local URLs:

- Storefront: http://localhost:5473/
- Admin dashboard: http://localhost:5474/admin/
- Nginx storefront proxy: http://localhost/
- Nginx admin proxy: http://localhost/admin/

## EC2 Hostname Setup

The assignment requires the public EC2 IP address, so the IP links above are the primary review links. The deployment also supports the friendlier hostname `otbtstore.demo` when it is mapped locally.

Add this entry to your local hosts file:

```text
16.176.211.132 otbtstore.demo
```

On macOS or Linux, use `sudo` to edit `/etc/hosts`. On Windows, edit `C:\Windows\System32\drivers\etc\hosts` as administrator.

After adding the entry, open:

- http://otbtstore.demo/
- http://otbtstore.demo/admin/

## Useful Commands

```bash
pnpm run typecheck
pnpm run build
pnpm run verify
```
