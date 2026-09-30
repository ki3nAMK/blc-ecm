# blc-ecm — Decentralized E-Commerce Marketplace

A blockchain-backed e-commerce marketplace: sellers list products that are minted on-chain
(ERC-1155), buyers check out through an on-chain escrow contract, and a NestJS/MongoDB backend
+ React frontend provide the actual shopping experience (browsing, chat, orders, affiliate
program, etc.) on top of that.

This repo was flattened on 2026-09-30 from three previously-separate git repositories into one
monorepo. Each still has its own standalone GitHub remote (`ki3nAMK/ecommerce-contract`,
`ki3nAMK/ecommerce-contract-api`, `ki3nAMK/ecommerce-smart-contract`) with the pre-flatten
history, but **this repo (`ki3nAMK/blc-ecm`) is now the actively-developed one** — treat it as
the source of truth going forward.

## Repo layout

```
blc-ecm/
├── ecommerce-smart-contract/   Hardhat + Solidity — the on-chain layer
├── ecommerce-contract-api/     NestJS + MongoDB + Redis — the backend API
├── ecommerce-contract/         Vite + React + MUI — the frontend
├── start-all.sh                 One-shot script that boots the entire stack
└── contracts/, hardhat.config.js, scripts/, test/, ignition/   ← leftover `npx hardhat init`
    boilerplate at the repo root, NOT part of the app. The real contracts live in
    ecommerce-smart-contract/. Safe to ignore (or delete).
```

## Tech stack per sub-project

**`ecommerce-smart-contract`** — Hardhat, Solidity 0.8.28, TypeScript. Key contracts:
`Escrow.sol` (checkout/order escrow, referral commission split), `MyERC1155.sol` (product
tokens), `AirdropDistributor.sol` (Merkle-claim airdrop). `scripts/deploy.js` deploys everything
and seeds product listings.

**`ecommerce-contract-api`** — NestJS, Mongoose (MongoDB), Redis (caching + distributed locks +
Socket.IO adapter), Socket.IO (real-time chat/notifications), `ethers` (talks to the chain as an
admin/relayer account), JWT auth (RS256, asymmetric keys). Entities follow a consistent
`BaseEntity` / `BaseRepositoryAbstract` / `BaseServiceAbstract` pattern — look at an existing
feature (e.g. `conversation`/`message`) as the template before adding a new one.

**`ecommerce-contract`** — Vite, React, MUI (based on the Minimal UI Kit template — a lot of
unused template cruft/env vars like Firebase/Supabase/AWS Amplify/Mapbox ship with it; this
project only actually uses `VITE_SERVER_URL`, `VITE_SOCKET_URI`, `VITE_ASSET_URL`), React Query
(`@tanstack/react-query`) for server state, `ethers` + browser wallet (MetaMask) for auth and
on-chain writes, `socket.io-client` for real-time chat/notifications, `i18next` for EN/VI
translation (currently wired for header/footer/home only — see `src/locales/`).

## Prerequisites

- Docker Desktop (MongoDB + Redis run as containers)
- Node.js + Yarn
- A Git Bash / POSIX shell (for `start-all.sh`; on Windows, Git Bash works — this project is
  developed on Windows)
- MetaMask browser extension, configured with a custom network pointed at
  `http://127.0.0.1:8545` (Hardhat's local chain), for any real end-to-end testing through the UI

## Config files you must create (all gitignored, none are in this repo)

| File | Based on | Purpose |
|---|---|---|
| `ecommerce-contract-api/config.yml` | `config.yml.example` | Backend runtime config: Mongo/Redis connection, deployed contract addresses, `blockchain.adminPrivateKey` (the relayer account), `server.masterKey` |
| `ecommerce-contract-api/secure/access_token_private.key` + `.pub` | — | RS256 keypair for signing access tokens. Generate with `openssl genrsa -out access_token_private.key 2048 && openssl rsa -in access_token_private.key -pubout -out access_token_public.key` |
| `ecommerce-contract-api/secure/refresh_token_private.key` + `.pub` | — | Same, for refresh tokens |
| `ecommerce-contract/.env` | `.env.example` | Frontend: API base URL, socket URI, asset URL |
| `ecommerce-smart-contract/.env` | `.env.example` | Deployer/test account keys (the `.example` file already contains Hardhat's well-known public test-mnemonic keys — safe to use verbatim for local dev) and Mongo connection (the deploy script writes product listings directly to Mongo) |

After deploying contracts (`npx hardhat run scripts/deploy.js --network localhost` inside
`ecommerce-smart-contract`), copy the printed contract addresses into
`ecommerce-contract-api/config.yml`'s `blockchain.*Address` fields.

## Running everything

```bash
./start-all.sh
```

Boots Docker (Mongo + Redis), a local Hardhat node, deploys contracts (only on a fresh chain —
skipped if `:8545` is already listening, to avoid redeploying over existing on-chain state and
its matching Mongo product data), then the backend and frontend. Every step is idempotent —
already-running services are detected by port and skipped, so re-running it is safe. Logs go to
`.run-logs/`; services keep running in the background after the script exits.

Manual equivalent, if you'd rather run things individually:

```bash
cd ecommerce-contract-api && docker compose up -d          # Mongo + Redis
npx hardhat node                                            # from ecommerce-smart-contract
npx hardhat run scripts/deploy.js --network localhost       # from ecommerce-smart-contract, fresh chain only
yarn start:dev                                               # from ecommerce-contract-api
yarn dev                                                     # from ecommerce-contract
```

Default ports: frontend `:8081`, backend `:3000`, Hardhat `:8545`, MongoDB `:27017`, Redis
`:6379`.

## Architecture notes worth knowing before touching this code

**Auth is wallet-based, not password-based.** Login = MetaMask `personal_sign` of a one-time
nonce (`I am signing my one-time nonce: ${nonce}`) → POST to `/api/v1/auth/verify` → JWT pair.
There's no way to script a real login without a browser wallet extension; to test as a specific
user, sign that exact message with `ethers.Wallet` using one of the Hardhat test private keys (see
`ecommerce-smart-contract/.env.example`), POST it yourself, and inject the resulting
`accessToken` into `sessionStorage` under the key `ECOMMERCE_ACCESS_TOKEN`.

**Two Socket.IO namespaces, one per role** (`CLIENT`, `SELLER` — see `SocketNamespace` in
`ecommerce-contract/src/types/socket.ts` and the matching NestJS gateways in
`ecommerce-contract-api/src/gateways/`). Each namespace needs its own JWT-auth middleware
registered in `ecommerce-contract-api/src/configs/redis-adapter.config.ts` — it's easy to add a
new namespace/gateway and forget this step (this happened for real: the SELLER namespace had no
socket auth middleware at all for a while, which silently broke seller-side real-time features).
Each gateway's `handleConnection` joins the socket to a room named after the user's own
`userId`, so server-side code just does `server.to(userId).emit(...)` to push to a specific user
without any other room bookkeeping.

**Axios response interceptor auto-unwraps single-object responses.** In
`ecommerce-contract/src/lib/baseRequest.ts`, a response of `{ data: X }` gets unwrapped to just
`X` by the interceptor — but `{ data: [...], pagination }` (paginated list responses) keeps the
wrapper. Forgetting this distinction when writing a new frontend service method is a very easy
bug to introduce (accessing `.data.data` on an already-unwrapped single object, or forgetting
`.data` on a paginated one).

**MUI polymorphic components as router links need explicit `display`.** `<Card component={RouterLink}>`
or `<Box component={RouterLink}>` renders an `<a>` tag, which defaults to `display: inline` and
silently breaks flex/block children ("block-in-inline" CSS bug — content gets clipped or
mis-laid-out). Always set `sx={{ display: 'flex' }}` (or `'block'`) explicitly when using
`component={RouterLink}` on a container.

**Vite Fast Refresh can't hot-reload a file that exports both a component/hook and a plain
value** (e.g. an enum) from the same module. If you edit a context provider file and the browser
doesn't pick up the change, check the Vite dev server log for `Could not Fast Refresh (...
export is incompatible)` — the fix is a hard refresh (Ctrl+Shift+R), not just waiting for HMR.

**Entity pattern**: every new Mongoose feature follows `entity` (schema) → `repo` (extends
`BaseRepositoryAbstract`) → `service` (extends `BaseServiceAbstract`, holds business logic) →
`controller`. Look at `conversation`/`message` (chat feature) as a complete recent example
end-to-end, including a populated-ref field (`productId` on `Message`) and a paginated list
endpoint.

## Known gaps / not done

- i18n (`i18next`) is only wired for the header, footer, and home page — not the rest of the app.
- No automated test suite is actively maintained for the frontend or backend (Jest is configured
  in the backend but coverage is minimal); most verification in this project has been manual
  browser testing.
- `gh` CLI is not installed in the dev environment — pushes go through plain `git` over
  HTTPS/whatever credential helper is configured.
