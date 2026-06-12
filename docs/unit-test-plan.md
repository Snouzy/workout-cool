# Plan de pruebas unitarias

## Objetivo

Implementar una estrategia de pruebas unitarias para Workout Cool que valide la lógica crítica del producto, reduzca regresiones en flujos principales y permita medir cobertura de forma continua en CI.

El proyecto actualmente no tiene framework de pruebas configurado. Este plan propone introducir una base moderna para Next.js, React 19, TypeScript, Server Actions, React Query, Zustand, Zod, Prisma y componentes UI.

## Alcance

Las pruebas unitarias cubrirán:

- Componentes React críticos y sus estados principales.
- Hooks de negocio y stores locales.
- Schemas Zod y validaciones de formularios.
- Funciones puras en `shared/lib`, `features/*/lib` y helpers.
- Server Actions con dependencias mockeadas.
- Manejo de errores, permisos, loading states y estados vacíos.

Fuera de alcance inicial:

- Pruebas end-to-end completas de navegación.
- Pruebas visuales/regresión por screenshot.
- Pruebas reales contra Stripe, RevenueCat, OpenPanel, SMTP o APIs externas.
- Pruebas de carga/performance.

Estos puntos pueden agregarse en una fase posterior con Playwright y entornos de staging.

## Tecnologías recomendadas

### Framework principal

**Vitest**

- Compatible con TypeScript y Vite-style tooling.
- API similar a Jest.
- Buen soporte para mocks, spies y coverage.
- Rápido para ejecución local y CI.

### Testing de componentes

**React Testing Library**

- Pruebas enfocadas en comportamiento visible para el usuario.
- Evita acoplar las pruebas a detalles internos del componente.
- Ideal para formularios, tablas, modales, botones, estados vacíos y errores.

**@testing-library/user-event**

- Simula interacciones reales: escribir, hacer click, tab, submit.

**@testing-library/jest-dom**

- Matchers legibles como `toBeInTheDocument`, `toBeDisabled`, `toHaveTextContent`.

### Mocks de red y APIs

**MSW**

- Mock de requests HTTP cuando se prueben hooks o servicios que consumen API.
- Permite simular respuestas exitosas, errores 401/403/500, timeouts y datos vacíos.

### Coverage

**@vitest/coverage-v8**

- Reportes en consola, HTML y CI.
- Permite umbrales por líneas, ramas, funciones y statements.

### Entorno DOM

**jsdom**

- Necesario para renderizar componentes React en pruebas unitarias.

## Dependencias sugeridas

```bash
pnpm add -D vitest @vitest/coverage-v8 @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom msw
```

Scripts sugeridos en `package.json`:

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest run --coverage"
}
```

## Configuración base sugerida

Crear `vitest.config.ts`:

```typescript
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/types/**",
        "src/**/constants/**",
        "src/test/**",
        "src/**/*.stories.*"
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 60
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      locales: path.resolve(__dirname, "./locales")
    }
  }
});
```

Crear `src/test/setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

Nota: si se agregan pruebas de componentes que dependen de `next/navigation`, `next/image`, `nuqs`, React Query o providers de i18n, se deben crear mocks/wrappers reutilizables en `src/test/`.

## Estrategia de cobertura

### Umbral inicial

Para iniciar sin bloquear el desarrollo por deuda existente:

- Líneas: 70%
- Statements: 70%
- Funciones: 70%
- Branches: 60%

### Meta a mediano plazo

Después de cubrir los módulos críticos:

- Líneas: 80%
- Statements: 80%
- Funciones: 80%
- Branches: 70%

### Meta para lógica crítica

En módulos de alto riesgo se debe buscar 85% o más:

- Autenticación y recuperación de contraseña.
- Server Actions que escriben datos.
- Workout Builder.
- Workout Session.
- Programas y progreso.
- Pagos, premium y permisos.
- Admin users/programs.
- Schemas Zod.

## Priorización por riesgo

### Prioridad 1: flujos críticos del usuario

#### Autenticación

Archivos principales:

- `src/features/auth/signin/ui/CredentialsLoginForm.tsx`
- `src/features/auth/signup/ui/signup-form.tsx`
- `src/features/auth/forgot-password/ui/forgot-password-form.tsx`
- `src/features/auth/reset-password/ui/reset-password-form.tsx`
- `src/features/auth/*/schema/*.ts`

Casos a probar:

- Render de campos obligatorios.
- Validación de email inválido.
- Validación de contraseña obligatoria/mínima.
- Submit exitoso llama al hook/action correspondiente.
- Estados de loading deshabilitan botones.
- Errores del servidor se muestran al usuario.
- Schemas aceptan datos válidos y rechazan datos inválidos.

#### Workout Builder

Archivos principales:

- `src/features/workout-builder/ui/workout-stepper.tsx`
- `src/features/workout-builder/ui/exercises-selection.tsx`
- `src/features/workout-builder/ui/equipment-selection.tsx`
- `src/features/workout-builder/ui/exercise-card.tsx`
- `src/features/workout-builder/ui/favorite-button.tsx`
- `src/features/workout-builder/hooks/use-workout-stepper.ts`
- `src/features/workout-builder/model/workout-builder.store.ts`
- `src/features/workout-builder/actions/*.ts`

Casos a probar:

- Selección de músculos/equipamiento.
- Avance y retroceso del stepper.
- Estado vacío cuando no hay ejercicios.
- Selección de ejercicio.
- Favoritos: agregar, quitar y sincronizar.
- Acciones con filtros por músculo/equipamiento.
- Manejo de errores cuando falla la carga de ejercicios.

#### Workout Session

Archivos principales:

- `src/features/workout-session/ui/workout-session-set.tsx`
- `src/features/workout-session/ui/workout-session-sets.tsx`
- `src/features/workout-session/ui/workout-session-timer.tsx`
- `src/features/workout-session/ui/workout-session-list.tsx`
- `src/features/workout-session/model/workout-session.store.ts`
- `src/features/workout-session/actions/*.ts`
- `src/shared/lib/workout-session/*.ts`

Casos a probar:

- Render de series, repeticiones, peso y tipo de set.
- Edición de set actualiza el estado esperado.
- Timer inicia, pausa y reinicia.
- Lista muestra sesiones existentes.
- Estado vacío sin sesiones.
- Sincronización local/remota con éxito.
- Sincronización con error conserva datos locales.
- Eliminación de sesión llama a la action correcta.

#### Programas

Archivos principales:

- `src/features/programs/ui/program-card.tsx`
- `src/features/programs/ui/program-detail-page.tsx`
- `src/features/programs/ui/program-progress.tsx`
- `src/features/programs/ui/session-access-guard.tsx`
- `src/features/programs/actions/*.ts`
- `src/features/programs/lib/*.ts`

Casos a probar:

- Card muestra nombre, nivel, duración y CTA correcto.
- Progreso calcula sesiones completadas y porcentaje.
- Guard bloquea sesiones no disponibles.
- Inscripción a programa maneja éxito/error.
- Inicio y completado de sesión actualiza progreso.
- Metadata y traducciones se construyen correctamente.

### Prioridad 2: administración y negocio

#### Admin users

Archivo principal:

- `src/features/admin/users/list/ui/users-table.tsx`

Casos a probar:

- Render con usuarios iniciales.
- Estado loading muestra skeletons.
- Estado error muestra mensaje de error.
- Estado vacío muestra "Aucun utilisateur trouvé".
- Búsqueda actualiza query después del debounce.
- Orden por email y fecha alterna `asc`/`desc`.
- Paginación cambia la página.
- Botón de impersonación llama `authClient.admin.impersonateUser`.
- Impersonación exitosa recarga la página.
- Error de impersonación muestra alerta y limpia loading.

Mocks necesarios:

- `getUsersAction`.
- `authClient.admin.impersonateUser`.
- `nuqs/useQueryState`.
- React Query wrapper con `QueryClientProvider`.
- `window.location.reload` y `window.alert`.

#### Admin programs

Archivos principales:

- `src/features/admin/programs/ui/program-builder.tsx`
- `src/features/admin/programs/ui/create-program-form.tsx`
- `src/features/admin/programs/ui/add-week-modal.tsx`
- `src/features/admin/programs/ui/add-session-modal.tsx`
- `src/features/admin/programs/ui/add-exercise-modal.tsx`
- `src/features/admin/programs/ui/edit-sets-modal.tsx`
- `src/features/admin/programs/actions/*.ts`

Casos a probar:

- Crear programa con datos válidos.
- Validar campos requeridos.
- Agregar semana.
- Agregar sesión.
- Agregar ejercicio a sesión.
- Editar sets/reps/rest time.
- Cambiar visibilidad público/privado.
- Eliminar programa solicita confirmación y ejecuta action.
- Errores de action se muestran sin cerrar modal.

#### Premium y pagos

Archivos principales:

- `src/shared/lib/premium/*.ts`
- `src/shared/lib/premium/providers/*.ts`
- `src/shared/lib/revenuecat/*.ts`
- `src/features/premium/ui/*.tsx`
- `app/api/webhooks/stripe/route.ts`
- `app/api/webhooks/revenuecat/route.ts`

Casos a probar:

- Usuario free ve CTA de upgrade.
- Usuario premium no ve bloqueo.
- Mapeo de planes/precios.
- Provider de Stripe genera checkout esperado con datos válidos.
- Errores de proveedor se transforman a errores controlados.
- Webhooks procesan eventos esperados y rechazan payloads inválidos.

Nota: los webhooks pueden requerir pruebas de integración ligeras; aun así se debe cubrir la lógica pura y los mapeos como unit tests.

### Prioridad 3: módulos de soporte visibles

#### Leaderboard

Archivos principales:

- `src/features/leaderboard/ui/leaderboard-page.tsx`
- `src/features/leaderboard/ui/leaderboard-item.tsx`
- `src/features/leaderboard/ui/user-leaderboard-position.tsx`
- `src/features/leaderboard/actions/*.ts`
- `src/features/leaderboard/lib/utils.ts`

Casos a probar:

- Ranking renderiza usuarios en orden correcto.
- Posición del usuario actual se muestra correctamente.
- Estados loading y empty.
- Errores de action no rompen la página.

#### Statistics

Archivos principales:

- `src/features/statistics/components/*.tsx`
- `src/features/statistics/hooks/use-exercise-statistics.ts`
- `src/shared/types/statistics.types.ts`

Casos a probar:

- Selector de ejercicio cambia el ejercicio activo.
- Selector de timeframe cambia el rango.
- Charts reciben datos transformados correctamente.
- Empty state cuando no hay estadísticas.
- Cálculos de volumen, progreso y 1RM.

#### Consent, contacto y email

Archivos principales:

- `src/features/consent-banner/ui/consent-banner.tsx`
- `src/features/consent-banner/schema/tracking-consent.schema.ts`
- `src/features/contact-feedback/*`
- `src/features/contact/support/*`
- `src/features/email/*`

Casos a probar:

- Aceptar/rechazar consentimiento.
- Validaciones de formularios.
- Submit exitoso.
- Error de servidor.
- No enviar formulario inválido.

## Schemas Zod

Todos los schemas deben tener pruebas directas con `safeParse`.

Archivos principales:

- `src/features/auth/signup/schema/signup.schema.ts`
- `src/features/auth/signin/schema/signin.schema.ts`
- `src/features/auth/reset-password/schema/reset-password.schema.ts`
- `src/features/auth/forgot-password/forgot-password.schema.ts`
- `src/features/update-password/model/update-password.schema.ts`
- `src/features/contact-feedback/model/contact-feedback.schema.ts`
- `src/features/contact/support/contact-support.schema.ts`
- `src/features/email/email.schema.ts`
- `src/entities/user/schemas/*.ts`
- `src/features/workout-builder/schema/get-exercises.schema.ts`

Casos mínimos por schema:

- Caso válido.
- Campo requerido faltante.
- Formato inválido.
- Longitud mínima/máxima.
- Reglas cruzadas, por ejemplo confirmación de contraseña.

## Server Actions

Las Server Actions deben probarse aislando sus dependencias:

- Prisma mockeado.
- Sesión/usuario mockeado.
- Safe action client mockeado cuando aplique.
- Servicios externos mockeados.

Casos mínimos:

- Usuario autorizado.
- Usuario no autenticado.
- Usuario sin permisos.
- Input inválido.
- Operación exitosa.
- Error de base de datos.
- Error controlado devuelto al cliente.

Acciones críticas:

- `src/features/auth/signup/model/signup.action.ts`
- `src/features/programs/actions/*.ts`
- `src/features/workout-builder/actions/*.ts`
- `src/features/workout-session/actions/*.ts`
- `src/features/admin/programs/actions/*.ts`
- `src/entities/user/model/get-users.actions.ts`
- `src/features/update-password/model/update-password.action.ts`

## Helpers y lógica pura

Priorizar funciones sin UI porque son rápidas de probar y suben cobertura con bajo costo.

Archivos principales:

- `src/shared/lib/date.ts`
- `src/shared/lib/format.ts`
- `src/shared/lib/slug.ts`
- `src/shared/lib/weight-conversion.ts`
- `src/shared/lib/guards.ts`
- `src/shared/lib/access-control.ts`
- `src/shared/lib/i18n-mapper.ts`
- `src/shared/lib/locale-slug.ts`
- `src/shared/lib/premium/premium.service.ts`
- `src/features/programs/lib/*.ts`
- `src/features/leaderboard/lib/utils.ts`
- `src/features/release-notes/lib/date-utils.ts`
- `src/features/update-password/lib/validate-password.ts`

Casos a probar:

- Entradas normales.
- Entradas límite.
- Entradas nulas o vacías cuando el tipo lo permita.
- Errores esperados.
- Formatos por locale cuando aplique.

## Convenciones de archivos

Colocar las pruebas junto al archivo probado:

```text
src/features/auth/signin/schema/signin.schema.ts
src/features/auth/signin/schema/signin.schema.test.ts
```

Para componentes:

```text
src/features/admin/users/list/ui/users-table.tsx
src/features/admin/users/list/ui/users-table.test.tsx
```

Para helpers de testing:

```text
src/test/setup.ts
src/test/render.tsx
src/test/mocks/
src/test/fixtures/
```

## Patrón recomendado para componentes

Crear un helper `renderWithProviders` que incluya:

- `QueryClientProvider`.
- Providers de tema si son necesarios.
- Providers de i18n si el componente los consume.
- Configuración base para `nuqs` cuando se prueben query params.

Reglas:

- Usar queries accesibles: `getByRole`, `getByLabelText`, `getByText`.
- Evitar snapshots grandes.
- Probar comportamiento, no implementación interna.
- Mockear solo límites externos: APIs, navegación, storage, actions, providers.

## Mocks recomendados

### Next.js

Mockear cuando aplique:

- `next/navigation`: `useRouter`, `usePathname`, `useSearchParams`, `redirect`.
- `next/image`: reemplazo simple por `img` si causa problemas.
- `next/headers`: cookies/headers en acciones server.

### Browser APIs

Mockear:

- `window.alert`.
- `window.location.reload`.
- `localStorage`.
- `matchMedia`.
- `ResizeObserver`.
- `IntersectionObserver`.

### Fecha y tiempo

Usar fake timers para:

- Debounce de búsqueda.
- Timers de workout.
- Notificaciones temporales.
- Expiración de estados.

Ejemplo:

```typescript
vi.useFakeTimers();
await user.type(input, "john@example.com");
vi.advanceTimersByTime(500);
```

## Integración con CI

En GitHub Actions o pipeline equivalente:

```bash
pnpm lint
pnpm test:run
pnpm test:coverage
pnpm build
```

Recomendación inicial:

- Bloquear PR si falla `lint`, `test:run` o `build`.
- Reportar coverage sin bloquear durante la primera fase.
- Activar bloqueo por coverage cuando los módulos Prioridad 1 estén cubiertos.

## Roadmap de implementación

### Fase 1: base técnica

- Instalar dependencias de testing.
- Crear `vitest.config.ts`.
- Crear `src/test/setup.ts`.
- Crear `src/test/render.tsx`.
- Agregar scripts en `package.json`.
- Configurar coverage HTML y lcov.
- Agregar primer test de smoke para confirmar que el entorno funciona.

### Fase 2: lógica pura y schemas

- Cubrir schemas de auth, contacto, email y usuario.
- Cubrir helpers de `shared/lib`.
- Cubrir helpers de programas, leaderboard y release notes.

Objetivo: subir cobertura rápido con pruebas estables.

### Fase 3: componentes críticos

- Auth forms.
- `UsersTable`.
- Workout Builder.
- Workout Session.
- Program cards/progress.
- Premium UI.

Objetivo: validar comportamiento visible y estados de UI.

### Fase 4: actions y stores

- Stores de Zustand.
- Hooks de React Query.
- Server Actions con Prisma y auth mockeados.
- Sincronización local/remota de sesiones y favoritos.

Objetivo: cubrir reglas de negocio y errores.

### Fase 5: CI y estándares de PR

- Ejecutar tests en cada PR.
- Publicar reporte de coverage.
- Exigir tests nuevos para cambios en módulos críticos.
- Revisar umbrales cada sprint hasta llegar a la meta.

## Criterio de listo para nuevas funcionalidades

Una funcionalidad nueva se considera lista cuando:

- Tiene pruebas para validaciones principales.
- Tiene pruebas para estado exitoso y error.
- Tiene pruebas para estados loading/empty si aplica.
- No reduce coverage global por debajo del umbral definido.
- `pnpm lint`, `pnpm test:run` y `pnpm build` pasan correctamente.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Componentes muy acoplados a providers | Crear `renderWithProviders` y mocks compartidos |
| Server Actions difíciles de testear | Extraer lógica pura a servicios y probar actions con dependencias mockeadas |
| Tests frágiles por textos traducidos | Preferir roles, labels y fixtures controlados |
| Coverage bajo al inicio | Usar umbral inicial realista y subirlo por fases |
| Dependencias externas inestables | Mockear Stripe, RevenueCat, OpenPanel, email y APIs |
| Timers/debounce generan flakes | Usar fake timers de Vitest |

## Ejemplo de checklist por PR

- [ ] Se agregaron o actualizaron unit tests para la lógica modificada.
- [ ] Se probaron casos de éxito y error.
- [ ] Se probaron validaciones si hay formularios o schemas.
- [ ] Se probaron estados loading/empty si hay UI asincrónica.
- [ ] `pnpm test:run` pasa localmente.
- [ ] `pnpm lint` pasa localmente.
- [ ] No baja la cobertura por debajo del umbral acordado.
