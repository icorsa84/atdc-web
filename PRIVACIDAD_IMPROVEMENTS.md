# 🔒 Gestión de Privacidad y Datos Personales — ATDC

**Fecha de implementación:** Octubre 2026  
**Marco legal:** Ley N.º 19.628 + Ley N.º 21.719 (Chile)  
**Responsable de Datos:** Isaac Cornejo Salvo (`ico.icorsa84@gmail.com`)

---

## 1. Características Implementadas

### Frontend (`agente-chat.html`)

#### Panel de Privacidad Integral
- **Ubicación:** Botón "🔒 Privacidad" en el panel lateral (junto a "Mi cuenta" y "Cerrar sesión")
- **Acciones disponibles:**

1. **📥 Descarga de Datos Personales**
   - Endpoint: `GET /api/privacidad/mis-datos`
   - Exporta en formato JSON
   - Incluye: nombre, perfil, DISC, CV, conversaciones, plan, fechas

2. **👁️ Auditoría de Acceso**
   - Endpoint: `GET /api/privacidad/auditoria`
   - Muestra quién accedió a los datos y cuándo
   - Cumple con Ley 21.719 derecho de acceso

3. **✅ Gestión de Consentimientos**
   - Endpoints: `GET/POST /api/privacidad/consentimientos`
   - Controles independientes para:
     - Tratamiento de datos (obligatorio)
     - Marketing y comunicaciones
     - Analytics (Microsoft Clarity)
   - Guardado automático

4. **🔧 Derechos ARSOPB** (Ley 21.719)
   - **A**cceso ✓
   - **R**ectificación (formulario)
   - **S**upresión (solicitud)
   - **O**posición (solicitud)
   - **P**ortabilidad (JSON, CSV, Excel)
   - **B**loqueo (incluido en supresión)

5. **📋 Acceso Rápido**
   - Política de privacidad completa (modal existente)
   - Contacto directo con DPO (ico.icorsa84@gmail.com)

---

### Backend (`atdc_agent.py`)

#### Nuevos Endpoints de Privacidad

**1. GET `/api/privacidad/mis-datos`**
```json
{
  "participante": {
    "id": "...",
    "nombre": "...",
    "email": "...",
    "creado_en": "2026-10-25..."
  },
  "perfil": {
    "cargo_objetivo": "...",
    "sector": "...",
    "renta_objetivo": "..."
  },
  "disc": {...},
  "cv_info": {...},
  "conversaciones": {...},
  "plan": "Premium",
  "fecha_descarga": "2026-10-25..."
}
```

**2. GET `/api/privacidad/auditoria`**
```json
{
  "participante_id": "...",
  "eventos": [
    {
      "fecha": "...",
      "tipo": "ACCESO_PROPIO",
      "usuario": "El participante mismo",
      "accion": "Consultó sus datos personales"
    }
  ],
  "plazo_respuesta_dias": 5,
  "referencia_legal": "Ley N.º 21.719 — Derecho de Acceso"
}
```

**3. GET `/api/privacidad/consentimientos`**
```json
{
  "tratamiento": true,
  "marketing": false,
  "analytics": true,
  "fecha_actualizacion": "2026-10-25T04:50:00..."
}
```

**4. POST `/api/privacidad/consentimientos`**
- Permite actualizar consentimientos en tiempo real
- Se registra auditoría de cambios
- Retorna confirmación + datos actualizados

**5. POST `/api/privacidad/solicitudes`**
```json
{
  "tipo": "rectificacion|supresion|oposicion|portabilidad",
  "motivo": "Descripción del motivo",
  "formato": "JSON|CSV|Excel (solo para portabilidad)"
}
```

Respuesta:
```json
{
  "ok": true,
  "solicitud_id": "...",
  "estado": "pendiente",
  "plazo_respuesta": "5 días hábiles",
  "mensaje": "Tu solicitud fue registrada...",
  "contacto": "ico.icorsa84@gmail.com"
}
```

---

## 2. Compliance Legal

### Ley N.º 19.628 (Protección de la Vida Privada)
✅ Consentimiento explícito para recolección de datos  
✅ Información clara sobre tratamiento  
✅ Derecho de acceso a datos personales  
✅ Derecho de rectificación  
✅ Derecho a oposición  
✅ Seguridad mediante TLS 1.3  
✅ Almacenamiento en UE (Render.com — Frankfurt)

### Ley N.º 21.719 (Nueva Ley de Protección de Datos)
✅ Derechos ARSOPB completamente implementados:
- **Acceso** — descarga JSON en tiempo real
- **Rectificación** — formulario de solicitud (5 días hábiles)
- **Supresión** — solicitud con auditoría
- **Oposición** — formulario con motivo
- **Portabilidad** — múltiples formatos (JSON, CSV, Excel)
- **Bloqueo** — incluido en supresión

✅ Base legal mínima (consentimiento + legitimidad contractual)  
✅ Principio de mínima retención  
✅ Derecho al olvido implementado  
✅ Auditoría de acceso a datos  
✅ Notificación a DPO en solicitudes  
✅ Plazo de respuesta 5 días hábiles (legal)

---

## 3. Flujo de Usuario

### Acceso al Panel
1. Usuario abre sesión en ATDC
2. Panel lateral → botón "🔒 Privacidad"
3. Se abre modal con todas las opciones

### Descarga de Datos
1. Click "📥 Descargar mis datos"
2. Archivo JSON se descarga automáticamente
3. Evento registrado en auditoría

### Gestión de Consentimientos
1. Ver estado actual de cada consentimiento
2. Cambiar casillas según preferencia
3. Click "Guardar cambios"
4. Confirmación inmediata

### Solicitudes ARSOPB
1. Seleccionar tipo de derecho (rectificar, suprimir, etc.)
2. Describir motivo/contacto
3. El sistema registra la solicitud
4. DPO recibe notificación por email
5. Usuario se contacta vía email dentro de 5 días hábiles

---

## 4. Seguridad y Almacenamiento

| Aspecto | Implementación |
|---------|---|
| Transporte | TLS 1.3 (HTTPS obligatorio) |
| Autenticación | JWT con expiración 30 días |
| Base de datos | PostgreSQL (Render.com, Frankfurt) |
| Logs de auditoría | Registrados en DB |
| Copias de seguridad | Render Backup (automático) |
| Encriptación | A nivel de base de datos |

---

## 5. Auditoría y Trazabilidad

Cada acción en privacidad registra:
- **Timestamp** exacto
- **Tipo de acción** (DATA_ACCESS, CONSENT_UPDATE, PRIVACY_REQUEST)
- **Participante ID** y nombre
- **Detalles** de la acción
- **Usuario** que realizó la acción

Eventos registrados:
- Descarga de datos personales
- Cambios de consentimiento
- Solicitudes ARSOPB
- Acceso a auditoría

---

## 6. Notificaciones

### Emails Automáticos

**A participante:**
- Confirmación de descarga de datos
- Confirmación de cambio de consentimientos
- Confirmación de solicitud ARSOPB

**A DPO (ico.icorsa84@gmail.com):**
- Nueva solicitud ARSOPB con detalles
- Participante y motivo
- Plazo legal de respuesta

---

## 7. Variables de Entorno Requeridas

```bash
# Datos del Responsable/DPO
ADMIN_NOTIFY_EMAIL=ico.icorsa84@gmail.com

# Base de datos
DATABASE_URL=postgresql://user:pass@host/db

# Autenticación
JWT_SECRET=tu_clave_secreta_segura

# SMTP para emails
SMTP_USER=ico.icorsa84@gmail.com
SMTP_APP_PASSWORD=contraseña_app_gmail
```

---

## 8. Próximas Mejoras

- [ ] Integración con sistema de tickets para seguimiento de solicitudes ARSOPB
- [ ] Encriptación end-to-end para datos en reposo
- [ ] Dashbaord para DPO con todas las solicitudes pendientes
- [ ] Notificaciones SMS como alternativa a email
- [ ] Integración con sistema de consentimiento granular (OneTrust, similar)
- [ ] Exportación de auditoría en formato compatible con GDPRh

---

## 9. Contacto y Soporte

**Responsable de Datos Personales:**  
Isaac Cornejo Salvo  
📧 ico.icorsa84@gmail.com

**Para ejercer derechos ARSOPB:**
1. Usar el panel de privacidad en la app
2. O contactar directo al DPO por email
3. Respuesta garantizada en 5 días hábiles (Ley 21.719)

---

**Documento generado:** Octubre 25, 2026  
**Estado:** ✅ Implementado y en producción  
**Versión:** 1.0
