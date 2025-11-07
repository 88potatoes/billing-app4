// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `billing-app4_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);
export type Post = InferSelectModel<typeof posts>;

export const users = createTable(
  "user",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    clerkId: d.varchar({ length: 256 }).notNull().unique(),
  }),
  (t) => [index("user_name_idx").on(t.name)],
);
export type User = InferSelectModel<typeof users>;

export const oauthTokens = createTable(
  "oauth_token",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: d.varchar({ length: 50 }).notNull(), // 'google', 'microsoft', etc.
    refreshToken: d.text().notNull(),
    accessToken: d.text(),
    expiresAt: d.timestamp({ withTimezone: true }),
    scope: d.text(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("oauth_token_user_provider_idx").on(t.userId, t.provider)],
);
export type OAuthToken = InferSelectModel<typeof oauthTokens>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  oauthTokens: many(oauthTokens),
}));

export const oauthTokensRelations = relations(oauthTokens, ({ one }) => ({
  user: one(users, {
    fields: [oauthTokens.userId],
    references: [users.id],
  }),
}));
