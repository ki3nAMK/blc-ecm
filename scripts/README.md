# Dev data scripts

Three scripts for setting up and resetting local dev data. Everything goes through the
**real** app flows (REST API + signed on-chain transactions) — nothing writes fake data
directly into MongoDB except the two role fields (`ADMIN`/`SELLER`) that the app itself has
no self-service upgrade path for.

Requires the full local stack running first: Docker (MongoDB + Redis), `npx hardhat node`,
the backend (`yarn start:dev` in `ecommerce-contract-api`), and — for `01`/`02` — the
contracts already deployed (`00-reset-data.js` does this for you).

## Scripts

| Script | Purpose |
|---|---|
| `00-reset-data.js` | Wipes MongoDB, resets the Hardhat chain to genesis, and redeploys the 3 contracts fresh. Gets you back to an empty baseline. |
| `01-generate-accounts.js` | Creates one account per role (admin, 3 sellers, 1 affiliate, 2 buyers). Each seller gets 3 products created and listed on-chain, ready to purchase. |
| `02-mock-data.js` | Places a batch of orders (some referred by the affiliate, at varying stages of completion), a couple of product reviews, and an admin-approved Airdrop campaign. |
| `03-mock-blog.js` | Seeds a diverse set of published blog posts (real cover photos, varied topics) as the ADMIN account. Removes any existing posts first, so it's safe to re-run. |
| `04-mock-flash-sale.js` | Starts 3 demo flash sales on Seller One's products (active, scheduled, and one that expires ~15s after creation), and runs one full purchase at the discounted price. |

## Run order

```
node scripts/00-reset-data.js        # optional — only if you want a clean slate
node scripts/01-generate-accounts.js # required before 02 and 04
node scripts/02-mock-data.js
node scripts/03-mock-blog.js         # independent — only needs the ADMIN account, creates it itself if missing
node scripts/04-mock-flash-sale.js   # requires 01's products; re-running cancels any still-active sale from a previous run first
```

**`01` must run before `02`** — the mock-data script buys real products from the accounts
`01` creates and will refuse to run if they don't exist yet. `00` is optional and independent
— run it any time you want to wipe everything back to empty first.

All three scripts are idempotent-ish: accounts log back in instead of erroring if they
already exist, and `01` skips re-creating a seller's products if it already has some. `02`
will add another batch of orders each time it's re-run (it doesn't check for duplicates), so
reset first if you want a specific, reproducible dataset.

## Accounts created by `01`

Deterministic Hardhat default accounts (same mnemonic `npx hardhat node` uses), so addresses
are the same every time:

| Role | Account index | Notes |
|---|---|---|
| ADMIN | 0 | Can create/approve Airdrop campaigns |
| SELLER | 1, 2, 3 | "Seller One/Two/Three" — 3 listed products each |
| AFFILIATE | 5 | Has a referral code, earns commission on referred sales |
| CLIENT (buyer) | 4, 6 | "Buyer One/Two" |

`01` prints each account's address and private key at the end — import a private key into
MetaMask to browse the app as that account.

## What `00-reset-data.js` actually resets

1. MongoDB collections: `users`, `products`, `productreviews`, `orders`, `airdropcampaigns`.
2. The Hardhat chain, via `hardhat_reset` — all balances restored, all contract state gone.
3. Redeploys `MyERC1155`, `Escrow`, and `AirdropDistributor`, syncing the new addresses into
   `ecommerce-contract/src/config/blockchain.json` and `ecommerce-contract-api/config.yml`.
4. Uploaded product images under `ecommerce-contract-api/uploads/products/`.

**After running it, restart the backend** (`yarn start:dev`) — it reads `config.yml` once at
boot and won't pick up the freshly deployed contract addresses otherwise.
