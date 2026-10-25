# 🔍 Reporte QA Integral — DISC, Kostick, Informe Final y Chatbot

**Fecha:** Octubre 25, 2026  
**Auditor:** Claude Haiku 4.5  
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

He realizado auditoría técnica completa en 4 áreas del sistema ATDC:

| Área | Estado | Hallazgos | Severidad |
|------|--------|-----------|-----------|
| **DISC** | ⚠️ Parcialmente Compliant | 3 issues | MEDIA |
| **Kostick** | ⚠️ Parcialmente Compliant | 2 issues | MEDIA |
| **Informe Final** | ⚠️ Compliant con mejoras | 4 issues | MEDIA/ALTA |
| **Chatbot (Chat)** | ✅ Bien Implementado | 2 issues menores | BAJA |

---

## 1️⃣ AUDITORÍA DISC

### Archivo: `atdc_agent.py:1861-1898`
**Endpoint:** `POST /api/disc/guardar`

### ✅ Lo que está bien:

- ✅ Validación de plan (solo Profesional+)
- ✅ Interpretación de segmentos (label + descripción)
- ✅ Almacenamiento persistente en BD
- ✅ Auditoría registrada
- ✅ Manejo de errores 404

### ⚠️ Issues Encontrados:

#### **Issue #1: Falta validación de rangos de segmentos**
**Severidad:** MEDIA  
**Línea:** 1880  
```python
seg = int(req.natural.get(dim, 0) or 0)  # ❌ Sin validación de rango
```
**Problema:** Acepta valores fuera del rango 1-12 (DISC válido es 1-12)  
**Impacto:** Puntajes inválidos se guardan sin validar  
**Recomendación:**
```python
seg = int(req.natural.get(dim, 0) or 0)
if not (1 <= seg <= 12):
    raise HTTPException(status_code=400, 
        detail=f"Segmento {dim} inválido: {seg}. Debe estar entre 1 y 12.")
```

#### **Issue #2: Falta validación de código DISC**
**Severidad:** MEDIA  
**Línea:** 1884  
```python
"codigo": req.codigo,  # ❌ No valida si es código DISC válido
```
**Problema:** Acepta cualquier string como código DISC  
**Impacto:** Códigos inválidos (ej: "ZZZ", "123") se guardan  
**Recomendación:**
```python
CODIGOS_DISC_VALIDOS = ["D", "I", "S", "C", "DI", "DC", "DS", "ID", "IS", "IC", "SD", "SI", "SC", "CD", "CI", "CS"]
if req.codigo not in CODIGOS_DISC_VALIDOS:
    raise HTTPException(status_code=400, detail=f"Código DISC inválido: {req.codigo}")
```

#### **Issue #3: Falta integración con patrón natural/adaptado**
**Severidad:** MEDIA  
**Línea:** 1888-1889  
```python
"natural": req.natural,      # Solo almacena
"adaptado": req.adaptado,    # Sin análisis diferencial
```
**Problema:** No compara natural vs adaptado para identificar máscara laboral  
**Impacto:** Se pierde análisis de "flexibilidad/adaptabilidad"  
**Recomendación:**
```python
def _analizar_mascara_disc(natural, adaptado):
    cambios = sum(1 for n, a in zip(natural.values(), adaptado.values()) if abs(n - a) > 2)
    if cambios >= 2:
        return "MASCARA LABORAL SIGNIFICATIVA — Persona en rol muy exigente"
    return "Adaptación moderada — persona confortable en rol actual"

p["disc"]["analisis_mascara"] = _analizar_mascara_disc(req.natural, req.adaptado)
```

---

## 2️⃣ AUDITORÍA KOSTICK

### Archivo: `atdc_agent.py:1902-1943`
**Endpoint:** `POST /api/kostick/guardar`

### ✅ Lo que está bien:

- ✅ Validación de plan (solo Profesional+)
- ✅ Cálculo de TOP 3 y DEV 3 (bien estructurado)
- ✅ Síntesis automática
- ✅ Almacenamiento persistente

### ⚠️ Issues Encontrados:

#### **Issue #4: Falta validación de rangos de scores**
**Severidad:** MEDIA  
**Línea:** 1916  
```python
valores = {"LD": req.ld, "RI": req.ri, "OT": req.ot, "MR": req.mr, "RP": req.rp}
```
**Problema:** No valida si scores están en rango 0-100  
**Impacto:** Scores inválidos (ej: -5, 150) se aceptan  
**Recomendación:**
```python
CLUSTERS_KOSTICK = ["LD", "RI", "OT", "MR", "RP"]
for cluster, score in {"LD": req.ld, "RI": req.ri, ...}.items():
    if not (0 <= score <= 100):
        raise HTTPException(status_code=400, 
            detail=f"Score {cluster} inválido: {score}. Debe estar entre 0 y 100.")
```

#### **Issue #5: Orden inverso en DEV 3 (debería ser last 3, no reverse)**
**Severidad:** BAJA  
**Línea:** 1927  
```python
dev3 = [_KOSTICK_CLUSTERS_META[k] for k, _ in ordenados[-3:]]
```
**Problema:** `ordenados[-3:]` da los 3 más ALTOS al final (sigue orden ascendente)  
**Impacto:** Muestra los clusters "a desarrollar" incorrectamente  
**Recomendación:**
```python
ordenados = sorted(valores.items(), key=lambda kv: kv[1], reverse=True)
top3 = [_KOSTICK_CLUSTERS_META[k] for k, _ in ordenados[:3]]
dev3 = [_KOSTICK_CLUSTERS_META[k] for k, _ in ordenados[-3:]]  # ✅ Correcto

# O mejor aún, para mayor claridad:
scores_asc = sorted(valores.items(), key=lambda kv: kv[1])  # Ascendente
dev3 = [_KOSTICK_CLUSTERS_META[k] for k, _ in scores_asc[:3]]  # 3 más bajos
```

---

## 3️⃣ AUDITORÍA INFORME FINAL

### Archivo: `atdc_agent.py:4535-4610` (y builders)

### ✅ Lo que está bien:

- ✅ Validación de plan diferenciado (Esencial, Profesional, Premium)
- ✅ Validación de estado de pago
- ✅ Validación de sesión (Fix QA-SEGURIDAD-03) — bien hecho
- ✅ Límites de tokens ajustados por plan
- ✅ Thinking activated para análisis
- ✅ Auditoría registrada

### ⚠️ Issues Encontrados:

#### **Issue #6: Premium exige entrevista pero no maneja ausencia en Esencial/Profesional**
**Severidad:** ALTA  
**Línea:** 4581-4585  
```python
if plan == "Premium" and not participante.get("entrevistas"):
    raise HTTPException(...)  # ✅ Bien para Premium
```
**Problema:** Esencial y Profesional NO usan entrevista pero podrían no tener CV  
**Impacto:** Si CV no está cargado, el informe falla sin mensaje claro  
**Recomendación:**
```python
# Validar requisitos por plan
if plan == "Esencial":
    if not p.get("cv"):
        raise HTTPException(403, "CV no cargado — sube tu CV para generar el informe")
elif plan == "Profesional":
    if not p.get("cv") or not p.get("disc") or not p.get("kostick"):
        raise HTTPException(403, "Perfil incompleto — necesitas CV, DISC y Kostick")
elif plan == "Premium":
    if not p.get("entrevistas"):
        raise HTTPException(403, "Consultor debe evaluar tu entrevista primero")
```

#### **Issue #7: Builders de prompts no validan presencia de datos**
**Severidad:** MEDIA  
**Línea:** 4328-4354  
```python
def _construir_prompt_informe_esencial(p: dict) -> str:
    cv = p["cv"]  # ❌ KeyError si no existe
    return f"""..."""
```
**Problema:** Si CV no existe, lanza KeyError no controlado  
**Impacto:** Errores 500 confusos en lugar de 400 claro  
**Recomendación:**
```python
def _construir_prompt_informe_esencial(p: dict) -> str:
    cv = p.get("cv")
    if not cv:
        raise ValueError("CV no cargado — no se puede generar informe Esencial")
    # ... resto del código
```

#### **Issue #8: Parseo de secciones frágil (regex mejor que split)**
**Severidad:** MEDIA  
**Línea:** 4492-4530  
```python
def _parsear_secciones(texto: str) -> list[dict]:
    partes = texto.split("---SECCION---")  # ❌ Frágil si Claude varía formato
```
**Problema:** Si Claude usa `--SECCION--` o `SECCION:` en lugar de `---SECCION---`, falla  
**Impacto:** Informe se devuelve sin secciones (fallback a sección única)  
**Recomendación:**
```python
import re

def _parsear_secciones(texto: str) -> list[dict]:
    # Busca patrón más flexible
    patron = r'(?:^|\n)---+SECCION---+\s*\n(.*?)(?=\n?---+SECCION---|$)'
    matches = re.findall(patron, texto, re.DOTALL | re.IGNORECASE)
    
    if not matches:  # Si no hay secciones, devolver como una
        return [{
            "id": "informe",
            "icono": "📄",
            "titulo": "Informe Final",
            "contenido": texto,
        }]
    
    secciones = []
    for match in matches:
        lineas = match.split("\n", 1)
        cabecera = lineas[0] if lineas else ""
        cuerpo = lineas[1].strip() if len(lineas) > 1 else match
        
        # ... resto del parsing (igual)
```

#### **Issue #9: Max tokens para Premium podría ser insuficiente en casos complejos**
**Severidad:** BAJA  
**Línea:** 4609  
```python
max_tk = 18000  # Premium — potencialmente insuficiente
```
**Problema:** Con 8 secciones (incluyendo entrevista_eval), 18K tokens es justo  
**Impacto:** Último párrafo de plan de acción podría cortarse  
**Recomendación:**
```python
# Aumentar margen para Premium con datos extensos
if plan == "Premium":
    # Si hay entrevista larga, usar más tokens
    entrevistas_len = len(str(p.get("entrevistas", {})))
    if entrevistas_len > 2000:
        max_tk = 22000  # Más margen si hay mucho contenido
    else:
        max_tk = 18000
```

---

## 4️⃣ AUDITORÍA CHATBOT (Chat)

### Archivo: `atdc_agent.py:3178-3266`
**Endpoint:** `POST /api/chat`

### ✅ Lo que está bien:

- ✅ **Excelente:** Validación de sesión (Fix SEGURIDAD-01) — toma `pid` del JWT, no del body
- ✅ **Excelente:** Verificación de límite por plan con granularidad
- ✅ **Excelente:** Contador incrementado ANTES de llamar (evita doble cómputo)
- ✅ **Bien:** SSE streaming implementado correctamente
- ✅ **Bien:** Historial limitado a últimos 10 mensajes (no sobrecarga context)
- ✅ **Bien:** Auditoría y rate limiting

### ⚠️ Issues Encontrados:

#### **Issue #10: Límite de historial fijo (10) podría ser flexible**
**Severidad:** BAJA  
**Línea:** 3227  
```python
for m in req.historial[-10:]:  # ❌ Siempre últimos 10, sin considerar tokens
```
**Problema:** Con modelo Haiku y max_tokens 1024, 10 mensajes puede ser mucho  
**Impacto:** Contexto muy "pesado" para respuestas cortas, perdera información antigua  
**Recomendación:**
```python
# Ajustar historial según plan para mejor balance
if plan == "Inicial":
    max_historial = 5   # Chats cortos
elif plan == "Profesional":
    max_historial = 8   # Chats medianos
else:  # Premium
    max_historial = 12  # Chats extensos con conversaciones largas

for m in req.historial[-max_historial:]:
    ...
```

#### **Issue #11: Error handling básico (no diferencia tipo de error)**
**Severidad:** BAJA  
**Línea:** 3255-3257  
```python
except Exception as e:
    err_payload = json.dumps({"type": "error", "message": str(e)})
    yield f"data: {err_payload}\n\n"
```
**Problema:** Devuelve mismo error para RateLimitError, APIError, timeout, etc.  
**Impacto:** Frontend no puede distinguir "reintentar" vs "contactar soporte"  
**Recomendación:**
```python
except anthropic.RateLimitError:
    err = {"type": "error", "code": "rate_limit", "message": "Límite de llamadas excedido, intenta en 30s"}
except anthropic.APIError as e:
    err = {"type": "error", "code": "api_error", "message": "Error de API, contacta soporte"}
except asyncio.TimeoutError:
    err = {"type": "error", "code": "timeout", "message": "Respuesta tardó mucho, reinténtalo"}
except Exception as e:
    err = {"type": "error", "code": "unknown", "message": str(e)}
finally:
    yield f"data: {json.dumps(err)}\n\n"
```

---

## 🎯 Matriz de Priorización de Fixes

| ID | Área | Issue | Severidad | Esfuerzo | Prioridad |
|---|---|---|---|---|---|
| 1 | DISC | Validación de rangos | MEDIA | 1 hora | 🔴 ALTA |
| 2 | DISC | Validación de código | MEDIA | 1 hora | 🔴 ALTA |
| 3 | DISC | Análisis de máscara | MEDIA | 2 horas | 🟡 MEDIA |
| 4 | Kostick | Validación de scores | MEDIA | 1 hora | 🔴 ALTA |
| 5 | Kostick | Orden DEV 3 invertido | BAJA | 15 min | 🟡 MEDIA |
| 6 | Inf.Final | Validación pre-generación | ALTA | 2 horas | 🔴 ALTA |
| 7 | Inf.Final | Validación en builders | MEDIA | 1 hora | 🔴 ALTA |
| 8 | Inf.Final | Parseo frágil | MEDIA | 2 horas | 🟡 MEDIA |
| 9 | Inf.Final | Max tokens Premium | BAJA | 30 min | 🟢 BAJA |
| 10 | Chat | Historial flexible | BAJA | 1 hora | 🟢 BAJA |
| 11 | Chat | Error handling | BAJA | 1.5 horas | 🟢 BAJA |

---

## 📊 Resumen de Hallazgos

### Por Severidad:
- 🔴 **ALTA:** 1 issue (validación Premium)
- 🟡 **MEDIA:** 8 issues (validaciones, parsing, lógica)
- 🟢 **BAJA:** 2 issues (flexibilidad, error handling)

### Por Área:
- **DISC:** 3 issues → Necesita validaciones de rango y código
- **Kostick:** 2 issues → Necesita validaciones y orden
- **Informe Final:** 4 issues → Crítico: validación pre-generación
- **Chat:** 2 issues → Menor prioridad, mejoras UX

### Tiempo Total de Fixes:
**Ruta crítica:** 6-7 horas  
**Todas las mejoras:** 11-12 horas

---

## 🚀 Plan de Acción

### Sprint 1 (Fixes Críticos) — 2-3 días
- [x] Issue #1: Validación rango DISC
- [x] Issue #2: Validación código DISC
- [x] Issue #4: Validación scores Kostick
- [x] Issue #6: Validación pre-generación Informe Final
- [x] Issue #7: Validación en builders

### Sprint 2 (Mejoras) — 3-4 días
- [ ] Issue #3: Análisis máscara DISC
- [ ] Issue #5: Orden DEV 3 Kostick
- [ ] Issue #8: Parseo robusto de secciones
- [ ] Issue #9: Max tokens flexible Premium
- [ ] Issue #10: Historial flexible Chat
- [ ] Issue #11: Error handling granular Chat

---

## ✅ Recomendaciones Finales

1. **Validación input es crítica** — Los test psicométricos DEBEN validar rangos
2. **Informes Premium son complejos** — Necesitan pre-validación de datos completa
3. **Chat es sólido** — Solo mejoras menores de UX
4. **Documentación de API** — Agregar ejemplos de payloads válidos en cada endpoint

---

**Documento generado:** Octubre 25, 2026 04:58 AM  
**Siguiente revisión recomendada:** Después de implementar fixes críticos
