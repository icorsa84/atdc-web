# ATDC Web — Frontend GitHub Pages

Repositorio estático para **atdc.app** y **outplacement.atdc.app**.

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Redirect automático → `landing.html` |
| `landing.html` | Landing pública (`atdc.app`) |
| `agente-chat.html` | App de usuario (`outplacement.atdc.app`) |

## Deploy

1. Sube este repositorio a GitHub (nombre sugerido: `atdc-web`)
2. En GitHub → Settings → Pages → Branch: `main` / `/(root)`
3. Configura los dominios en Cloudflare (ver manual de despliegue)

## Dominio personalizado

- `atdc.app` → apunta a este repo (archivo `CNAME` con valor `atdc.app`)
- `outplacement.atdc.app` → apunta al mismo repo, GitHub Pages permite subdominios

El backend (`https://atdc-backend.onrender.com`) ya está configurado en `agente-chat.html`.
