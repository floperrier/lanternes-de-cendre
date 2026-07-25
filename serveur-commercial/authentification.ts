import {
  betterAuth,
  type BetterAuthOptions,
} from "better-auth";
import { magicLink } from "better-auth/plugins";

export interface OptionsDAuthentificationCommerciale {
  readonly baseUrl: string;
  readonly origineApplication: string;
  readonly secret: string;
  readonly database: NonNullable<BetterAuthOptions["database"]>;
  readonly cookiesSecurises?: boolean;
  readonly limitationActive?: boolean;
  readonly envoyerLien: (message: {
    readonly email: string;
    readonly url: string;
  }) => Promise<void>;
  readonly auditer: (
    evenement: "session.creee" | "session.revoquee",
    identifiant: string,
  ) => Promise<void>;
}

/**
 * Adaptateur de production du compte léger. Le service de développement
 * remplace seulement l’envoi d’email et la base afin de rester déterministe.
 */
export function creerAuthentificationCommerciale({
  baseUrl,
  origineApplication,
  secret,
  database,
  cookiesSecurises = true,
  limitationActive = true,
  envoyerLien,
  auditer,
}: OptionsDAuthentificationCommerciale) {
  if (
    secret.length < 32 ||
    new Set(secret).size < 16 ||
    /remplacer|change-me|placeholder/i.test(secret)
  ) {
    throw new Error(
      "BETTER_AUTH_SECRET doit contenir au moins 32 caractères à forte entropie.",
    );
  }

  return betterAuth({
    appName: "Les Lanternes de Cendre",
    baseURL: baseUrl,
    secret,
    database,
    trustedOrigins: [origineApplication],
    rateLimit: {
      enabled: limitationActive,
      storage: "database",
      customRules: {
        "/sign-in/magic-link": { window: 60, max: 5 },
        "/magic-link/verify": { window: 60, max: 10 },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      disableCSRFCheck: false,
      useSecureCookies: cookiesSecurises,
      cookiePrefix: "lanternes",
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: cookiesSecurises,
        path: "/",
      },
      ipAddress: {
        ipAddressHeaders: ["x-real-ip"],
        disableIpTracking: false,
      },
    },
    plugins: [
      magicLink({
        expiresIn: 300,
        storeToken: "hashed",
        sendMagicLink: async ({ email, url }) => {
          await envoyerLien({ email, url });
        },
      }),
    ],
    databaseHooks: {
      session: {
        create: {
          after: async (session) => {
            await auditer("session.creee", session.id);
          },
        },
        delete: {
          before: async (session) => {
            await auditer("session.revoquee", session.id);
          },
        },
      },
    },
  });
}
