import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ??
  "postgres://trustvault:trustvault_dev_password@localhost:55432/trustvault";
const migrationPath = resolve("infra/migrations/0001_initial_rls.sql");
const appDatabasePassword = process.env.APP_DATABASE_PASSWORD ?? "trustvault_app_dev_password";

if (!existsSync(migrationPath)) {
  console.error(`Migration file not found: ${migrationPath}`);
  process.exit(1);
}

const psqlVersion = spawnSync("psql", ["--version"], {
  stdio: "ignore",
  shell: process.platform === "win32"
});

if (psqlVersion.status === 0) {
  const result = spawnSync(
    "psql",
    [databaseUrl, "--set", `app_database_password=${appDatabasePassword}`, "-f", migrationPath],
    {
    stdio: "inherit",
    shell: process.platform === "win32"
    }
  );

  if (result.status === 0) {
    process.exit(0);
  }
}

const migrationSql = readFileSync(migrationPath, "utf8");
const dockerResult = spawnSync(
  "docker",
  [
    "exec",
    "-i",
    "trustvault-postgres",
    "psql",
    "--set",
    `app_database_password=${appDatabasePassword}`,
    "-U",
    "trustvault",
    "-d",
    "trustvault"
  ],
  {
    input: migrationSql,
    stdio: ["pipe", "inherit", "inherit"],
    shell: process.platform === "win32"
  }
);

process.exit(dockerResult.status ?? 1);
