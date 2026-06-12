# INT-01: Flujos de Integracion Auth -> DB -> Premium

## Objetivo

Definir el flujo de integracion entre autenticacion, persistencia en base de datos y estado premium para Workout Cool.

Este documento cubre el issue `#21` titulado `INT-01: Definir flujos de integración (auth → DB → premium)`.

## Alcance

### Incluido

- Registro e inicio de sesion.
- Validacion de sesion en acciones servidor.
- Persistencia de usuarios, suscripciones y enrolamientos en Prisma.
- Creacion de checkout premium.
- Sincronizacion de estado premium desde Stripe y RevenueCat.
- Consulta unificada del estado premium.

### Fuera de alcance

- Refactor de logica de negocio.
- Pruebas reales contra proveedores externos.
- Cambios visuales de interfaz.

## Componentes involucrados

| Capa | Archivos clave |
|------|----------------|
| Auth | `src/features/auth/signup/model/signup.action.ts`, `src/features/auth/lib/better-auth.ts`, `src/features/auth/lib/auth-client.ts` |
| DB | `src/shared/lib/prisma`, tablas `user`, `subscription`, `userProgramEnrollment`, `revenueCatWebhookEvent` |
| Premium | `src/shared/lib/premium/premium.service.ts`, `src/shared/lib/premium/premium.manager.ts` |
| Checkout | `app/api/premium/checkout/route.ts`, `src/features/premium/ui/premium-upgrade-card.tsx` |
| Status | `app/api/premium/status/route.ts` |
| Webhooks | `app/api/webhooks/stripe/route.ts`, `app/api/revenuecat/webhook/route.ts`, `app/api/revenuecat/link-user/route.ts`, `app/api/revenuecat/sync-status/route.ts` |
| Programas | `src/features/programs/actions/enroll-program.action.ts`, `src/features/programs/actions/start-program-session.action.ts`, `src/features/programs/actions/complete-program-session.action.ts` |

## Flujo 1: Registro y sesion

1. El usuario completa el formulario de registro.
2. `signUpAction` valida el input y llama a `auth.api.signUpEmail`.
3. Better Auth crea el usuario.
4. Si existe OpenPanel, se registra el evento analitico.
5. El usuario obtiene sesion y puede continuar hacia modulos protegidos.

Punto de integracion clave:

- La identidad nace en Auth.
- La fuente de verdad del usuario pasa a Prisma para permisos, premium y progreso.

## Flujo 2: Acceso a acciones servidor

1. Una accion protegida pide la sesion con `auth.api.getSession` o `serverRequiredUser`.
2. Si no hay sesion, la accion responde `Unauthorized`.
3. Si hay sesion, se obtiene `user.id`.
4. Prisma usa ese `user.id` para leer o escribir datos.

Ejemplos reales:

- `enrollInProgram(programId)` crea `userProgramEnrollment`.
- `startProgramSession(enrollmentId, sessionId)` inicia progreso de sesion.
- `completeProgramSession(...)` marca la sesion como completada.

## Flujo 3: Checkout premium

1. El usuario abre la tarjeta premium.
2. Si no esta autenticado, la UI guarda el plan pendiente y redirige a signin.
3. Si esta autenticado, la UI llama `POST /api/premium/checkout`.
4. El endpoint exige usuario autenticado con `serverRequiredUser`.
5. `PremiumManager.createCheckout` crea la sesion de pago para el proveedor elegido.
6. El frontend redirige al checkout devuelto por el backend.

Regla de integracion:

- La UI no decide el estado premium.
- El backend crea el checkout y la base de datos confirma el resultado posterior.

## Flujo 4: Sincronizacion premium

### Stripe

1. Stripe llama `POST /api/webhooks/stripe`.
2. El webhook valida la firma.
3. `PremiumManager.processWebhook("stripe", ...)` procesa el evento.
4. La suscripcion y el flag premium se actualizan en Prisma.

### RevenueCat

1. RevenueCat llama `POST /api/revenuecat/webhook`.
2. El webhook valida la firma HMAC.
3. Segun el tipo de evento:
   - `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION` activan premium.
   - `CANCELLATION`, `EXPIRATION` desactivan premium.
   - `BILLING_ISSUE` marca el ciclo como expirado.
   - `PRODUCT_CHANGE` actualiza la expiracion.
4. El servicio premium sincroniza estado, actualiza `user.isPremium` y la tabla `subscription`.

Regla de integracion:

- Los webhooks son la fuente de verdad para cambios de suscripcion.
- Prisma conserva el estado operable para la app.

## Flujo 5: Estado premium unificado

1. El frontend consulta `GET /api/premium/status`.
2. El backend obtiene la sesion compatible con mobile.
3. Prisma lee `user.isPremium` y suscripciones activas.
4. La respuesta expone:
   - `isPremium`
   - `source`
   - resumen de suscripciones
   - suscripcion actual, si existe

Uso:

- La UI decide bloquear o desbloquear features segun ese estado.

## Flujo 6: Relacion auth -> DB -> programas

1. El usuario entra autenticado.
2. `enrollInProgram` crea o reutiliza el enrolamiento.
3. Prisma incrementa `participantCount`.
4. `program-detail-page` y `ProgramSessionClient` usan ese estado para mostrar progreso.
5. La finalizacion de sesiones actualiza progreso en DB y refresca la vista del programa.

## Reglas del flujo

- Auth valida identidad.
- Prisma guarda el estado persistente.
- Premium no se calcula en la UI.
- Webhooks actualizan la verdad del sistema.
- Las acciones protegidas deben fallar sin sesion.

## Casos de integracion a verificar

| ID | Escenario | Resultado esperado |
|----|-----------|--------------------|
| INT-01-01 | Registro exitoso | Usuario creado en Auth y disponible para operar con Prisma |
| INT-01-02 | Accion sin sesion | Respuesta `Unauthorized` |
| INT-01-03 | Checkout con usuario autenticado | Se crea sesion de pago |
| INT-01-04 | Webhook Stripe valido | Estado premium actualizado en DB |
| INT-01-05 | Webhook RevenueCat valido | `user.isPremium` y `subscription` sincronizados |
| INT-01-06 | Consulta premium status | Respuesta refleja DB y suscripciones activas |
| INT-01-07 | Enrolamiento de programa | Se crea registro y se incrementa el contador |

## Criterio de aceptacion

- El documento debe servir como base para pruebas de integracion y seguimiento del sprint.
- Los flujos deben ser consistentes con el comportamiento real de los archivos citados.
- No debe quedar ambiguedad entre autenticar, persistir y sincronizar premium.

