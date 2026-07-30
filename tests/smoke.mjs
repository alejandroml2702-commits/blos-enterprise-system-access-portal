import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(resolve(root, "index.html"), "utf8");
const app = await readFile(resolve(root, "assets/js/app.js"), "utf8");
const config = await readFile(
  resolve(root, "assets/js/supabase-config.js"),
  "utf8",
);
const image = await stat(resolve(root, "assets/bes-login-brand.jpg"));

assert.match(html, /Content-Security-Policy/);
assert.match(html, /id="loginForm"/);
assert.match(html, /id="passwordForm"/);
assert.match(html, /id="provisionUserForm"/);
assert.match(html, /assets\/bes-login-brand\.jpg/);
assert.match(html, /Solo el propietario BES puede crear identidades/);
assert.match(app, /callBesEdge\("bes-auth"/);
assert.match(app, /"bes-activate"/);
assert.match(app, /"bes-admin-users"/);
assert.match(app, /membership\?\.role_code === "owner"/);
assert.match(app, /newPassword\.length >= 14/);
assert.doesNotMatch(html, /BES2026|perfiles de demostraci[oó]n/i);
assert.doesNotMatch(app, /signUp\s*\(/);
assert.doesNotMatch(config, /SUPABASE_SERVICE_ROLE_KEY|sb_secret_/i);
assert.ok(image.size > 100_000, "La imagen institucional parece incompleta");

console.log("BES portal smoke checks: PASS");
