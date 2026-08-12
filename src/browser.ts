import { Kookee } from './lib/client';

/**
 * Entry point for the `<script>` build served at kookee.dev/sdk/latest.js.
 *
 * A single default export, deliberately: tsup makes the default export the IIFE global, so
 * `Kookee` on the page IS the client class (`new Kookee({ projectId })`). Adding named
 * exports here would force consumers onto `Kookee.default` instead.
 *
 * Types, error classes and field helpers are not re-exported — a script-tag consumer has no
 * type system, and the helpers are reachable from the npm package.
 */
export default Kookee;
