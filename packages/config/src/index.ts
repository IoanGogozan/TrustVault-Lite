export type AppEnvironment = "development" | "test" | "production";

export type BaseConfig = {
  env: AppEnvironment;
  appName: string;
  publicOrigin?: string;
};

export function readBaseConfig(env: NodeJS.ProcessEnv = process.env): BaseConfig {
  const appEnv = env.NODE_ENV ?? "development";

  if (!isAppEnvironment(appEnv)) {
    throw new Error(`Invalid NODE_ENV: ${appEnv}`);
  }

  const publicOrigin = readPublicOrigin(env.PUBLIC_ORIGIN);

  if (appEnv === "production" && !publicOrigin) {
    throw new Error("PUBLIC_ORIGIN is required in production");
  }

  return {
    env: appEnv,
    appName: env.APP_NAME ?? "TrustVault Lite",
    ...(publicOrigin ? { publicOrigin } : {})
  };
}

function readPublicOrigin(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("PUBLIC_ORIGIN must be a valid URL origin");
  }

  if (url.origin !== value || url.username || url.password || url.pathname !== "/") {
    throw new Error("PUBLIC_ORIGIN must contain only scheme, host, and optional port");
  }

  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new Error("PUBLIC_ORIGIN must use HTTPS outside local development");
  }

  return url.origin;
}

function isAppEnvironment(value: string): value is AppEnvironment {
  return value === "development" || value === "test" || value === "production";
}
