# Deployment Targets

Updated: 2026-06-06

## This Project

- Domains: `yokhanfitness.ru`, `guide.yokhanfitness.ru`, `telegram.yokhanfitness.ru`
- Server: `83.217.200.15`
- Runtime: nginx static files
- Server path: `/var/www/yokhan-landing`
- Status: deployed

## Ecosystem Map

- Main web/services server: `83.217.200.15`
- Auth server: `72.56.247.58`
- Jump server for `cloak.yokhanfitness.ru` and `naive.yokhanfitness.ru`: `85.239.43.11`
- `app.yokhanfitness.ru`: intentionally parked, nginx returns `503` until app deploy is selected.

## Notes

- Do not move `cloak` or `naive` to the main web server; they intentionally live on the jump server.
- Do not treat `telegram.yokhanfitness.ru` as the bot runtime. It is a public entry page served from this landing release.
- `account.html` is the public BUFF IT ID entry. The static site does not store tokens, refresh tokens, passwords, or Keycloak client secrets.
- Current SSO status is tracked in `data/sso-map.json`:
  - connected: SmartCart (`smartcart-web`) and CALLS (`yokhan-callservice-web`);
  - public live, auth pending: Guide, Photo, Telegram entry;
  - parked by design: `app.yokhanfitness.ru` returns `503` until app deploy/auth migration is selected.
- Public verification after deploy: `py -3 scripts\check-public-buffit.py --base-url https://yokhanfitness.ru/`.
