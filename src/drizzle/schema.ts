import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: integer("userId", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
  userName: text("userName").notNull(),
});
