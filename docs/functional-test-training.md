# PF-entrenamiento: Casos de Prueba Funcionales

## 1. Objetivo

Validar funcionalmente los flujos de entrenamiento de Workout Cool, cubriendo la creacion de rutinas, ejecucion de sesiones,
registro de series y uso de programas predefinidos.

Este documento corresponde al issue [#33 PF-entrenamiento](https://github.com/Tabanos-Team/workout-cool/issues/33), asignado a
`JeremyCruzGallegos`.

## 2. Alcance

### Incluido

- Constructor de entrenamiento desde la pagina principal.
- Seleccion de equipamiento y musculos.
- Generacion, cambio, seleccion y eliminacion de ejercicios.
- Inicio, ejecucion y finalizacion de una sesion.
- Registro de series con repeticiones, peso, tiempo y peso corporal.
- Historial de sesiones: repetir y eliminar sesiones.
- Programas predefinidos: consulta, seleccion de semanas, inicio y finalizacion de sesiones.

### Fuera de alcance

- Pruebas visuales por captura.
- Pruebas de rendimiento.
- Validacion real de pagos o suscripciones externas.
- Pruebas directas contra servicios externos como Stripe, RevenueCat, SMTP, OpenPanel o YouTube.

## 3. Referencias

- Wiki: Plan de Pruebas Unitarias.
- Wiki: Informacion General del Proyecto.
- Requerimientos relacionados:
  - RF16: El usuario puede crear programas de entrenamiento personalizados.
  - RF17: El usuario puede acceder a programas de entrenamiento predefinidos.
  - RF18: El usuario puede registrar series, repeticiones y peso por ejercicio.

## 4. Ambiente de Prueba

| Elemento | Valor |
|----------|-------|
| Aplicacion | Workout Cool |
| Tipo | Aplicacion Web Progresiva |
| Framework | Next.js |
| Base de datos | PostgreSQL |
| Navegadores | Chrome, Firefox, Edge |
| Resoluciones | Desktop 1366x768, Mobile 390x844 |
| Datos base | Ejercicios importados desde `data/sample-exercises.csv` o seed equivalente |

## 5. Datos de Prueba

| Dato | Valor sugerido |
|------|----------------|
| Usuario anonimo | Sesion sin iniciar |
| Usuario autenticado | Cuenta de prueba con email valido |
| Usuario premium | Cuenta de prueba con estado premium habilitado |
| Equipamiento | Dumbbell, Barbell, Bodyweight |
| Musculos | Chest, Back, Quadriceps, Biceps |
| Serie por repeticiones | 12 reps |
| Serie por peso | 40 kg |
| Serie por tiempo | 1 min 30 sec |

## 6. Casos de Prueba Funcionales

| ID | Escenario | Precondicion | Pasos | Resultado esperado | RF |
|----|-----------|--------------|-------|--------------------|----|
| PF-ENT-01 | Bloquear avance sin equipamiento | Usuario en pagina principal | 1. Abrir constructor de entrenamiento. 2. No seleccionar equipamiento. 3. Intentar continuar. | El sistema mantiene al usuario en el paso de equipamiento y no permite avanzar. | RF18 |
| PF-ENT-02 | Seleccionar equipamiento y avanzar | Usuario en pagina principal | 1. Seleccionar al menos un equipamiento. 2. Presionar continuar. | El sistema avanza al paso de seleccion de musculos. | RF18 |
| PF-ENT-03 | Limpiar equipamiento seleccionado | Equipamiento seleccionado | 1. Presionar la opcion para limpiar equipamiento. | El equipamiento queda desmarcado y el avance vuelve a quedar bloqueado. | RF18 |
| PF-ENT-04 | Bloquear generacion sin musculos | Usuario en paso de musculos | 1. No seleccionar musculos. 2. Intentar continuar. | El sistema no avanza al paso de ejercicios. | RF18 |
| PF-ENT-05 | Generar ejercicios por musculo | Equipamiento y musculos seleccionados | 1. Seleccionar uno o mas musculos. 2. Continuar al paso de ejercicios. | Se muestran ejercicios agrupados segun los musculos seleccionados. | RF18 |
| PF-ENT-06 | Cambiar ejercicio sugerido | Lista de ejercicios generada | 1. Presionar la accion de cambiar ejercicio en una tarjeta. | El ejercicio seleccionado se reemplaza por otro compatible. | RF18 |
| PF-ENT-07 | Elegir ejercicio manualmente | Lista de ejercicios generada | 1. Abrir selector de ejercicio. 2. Elegir un ejercicio. | El ejercicio elegido reemplaza al ejercicio actual. | RF18 |
| PF-ENT-08 | Eliminar ejercicio del entrenamiento | Lista de ejercicios generada | 1. Presionar eliminar en un ejercicio. | El ejercicio desaparece de la rutina y el orden restante se conserva. | RF18 |
| PF-ENT-09 | Iniciar entrenamiento | Rutina con al menos un ejercicio | 1. Presionar iniciar entrenamiento. | Se abre la interfaz de sesion activa con ejercicios y series. | RF18 |
| PF-ENT-10 | Registrar serie por repeticiones | Sesion activa | 1. Seleccionar tipo Reps. 2. Ingresar 12. 3. Finalizar serie. | La serie queda marcada como completada y sus campos quedan deshabilitados. | RF18 |
| PF-ENT-11 | Registrar serie por peso | Sesion activa | 1. Agregar columna Weight. 2. Ingresar 40. 3. Seleccionar kg. 4. Finalizar serie. | La serie registra peso y unidad correctamente. | RF18 |
| PF-ENT-12 | Registrar serie por tiempo | Sesion activa | 1. Seleccionar tipo Time. 2. Ingresar 1 minuto y 30 segundos. 3. Finalizar serie. | La serie queda completada con duracion correcta. | RF18 |
| PF-ENT-13 | Editar serie completada | Serie completada | 1. Presionar editar. 2. Modificar valores. 3. Finalizar nuevamente. | La serie vuelve a modo edicion y permite guardar los cambios. | RF18 |
| PF-ENT-14 | Agregar y eliminar serie | Sesion activa | 1. Presionar agregar serie. 2. Eliminar la nueva serie. | La sesion refleja la adicion y eliminacion sin afectar otras series. | RF18 |
| PF-ENT-15 | Avanzar al siguiente ejercicio | Sesion con varios ejercicios | 1. Completar o dejar una serie. 2. Presionar siguiente ejercicio. | El foco cambia al siguiente ejercicio de la sesion. | RF18 |
| PF-ENT-16 | Finalizar sesion | Sesion activa | 1. Presionar finalizar sesion. | La sesion se completa, se muestra confirmacion y se sincroniza el historial si aplica. | RF18 |
| PF-ENT-17 | Repetir sesion anterior | Historial con sesion finalizada y sin sesion activa | 1. Abrir historial. 2. Presionar repetir. | El constructor carga equipamiento, musculos y ejercicios de la sesion anterior. | RF18 |
| PF-ENT-18 | Impedir repetir si hay sesion activa | Historial con sesion finalizada y una sesion activa | 1. Abrir historial. 2. Revisar accion repetir. | La accion repetir aparece deshabilitada mientras exista una sesion activa. | RF18 |
| PF-ENT-19 | Eliminar sesion del historial | Historial con sesion finalizada | 1. Presionar eliminar. 2. Confirmar eliminacion. | La sesion se elimina del historial. | RF18 |
| PF-ENT-20 | Cancelar eliminacion de sesion | Historial con sesion finalizada | 1. Presionar eliminar. 2. Cancelar confirmacion. | La sesion permanece en el historial. | RF18 |
| PF-ENT-21 | Consultar programas predefinidos | Programas cargados | 1. Abrir `/programs`. 2. Seleccionar un programa. | Se muestra detalle del programa con informacion, semanas y sesiones. | RF17 |
| PF-ENT-22 | Cambiar semana de programa | Programa con varias semanas | 1. Abrir pestaña de sesiones. 2. Seleccionar otra semana. | La lista muestra las sesiones de la semana seleccionada. | RF17 |
| PF-ENT-23 | Iniciar sesion de programa gratuita | Usuario con acceso permitido | 1. Abrir una sesion gratuita. 2. Presionar iniciar sesion. | El sistema inscribe al usuario si corresponde e inicia la sesion con ejercicios del programa. | RF17, RF18 |
| PF-ENT-24 | Bloquear sesion premium sin acceso | Usuario no premium en sesion premium | 1. Abrir una sesion premium. | El sistema muestra restriccion de acceso y no permite iniciar la sesion. | RF17 |
| PF-ENT-25 | Completar sesion de programa | Sesion de programa activa | 1. Finalizar entrenamiento. | La sesion se marca como completada y el usuario vuelve al programa con progreso actualizado. | RF17, RF18 |

## 7. Criterios de Aceptacion

- Todos los casos criticos `PF-ENT-01` a `PF-ENT-16` deben ejecutarse sin fallos bloqueantes.
- Los casos de programas `PF-ENT-21` a `PF-ENT-25` deben validar acceso gratuito, premium y actualizacion de progreso.
- Cualquier defecto detectado debe registrarse como issue y vincularse con el caso funcional afectado.
- La evidencia minima por caso debe incluir fecha, navegador, usuario utilizado, resultado y observaciones.

## 8. Estado del Entregable

| Campo | Valor |
|-------|-------|
| Issue | #33 PF-entrenamiento |
| Responsable | JeremyCruzGallegos |
| Estado | Diseñado |
| Fecha | 2026-06-04 |
