import { relations } from "drizzle-orm";
import { date, datetime, float, int, mysqlEnum, mysqlTable, serial, text } from "drizzle-orm/mysql-core";

/* 

Users are not in implementation scope for now, but can be implemented later. 
Currently the plan is, to have one default user, which is used to create all player entries.

*/
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull()
});

/**
 * Players are the actual players.
 */
export const players = mysqlTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  createdAt: datetime("createdAt").notNull(),
  createdBy: int("createdBy").notNull(),
  rating: int("rating"),
  priority: int("priority").notNull().default(9999),

});

export const ratings = mysqlTable("ratings", {
  id: serial("id").primaryKey(),
  averageSkill: float("averageSkill").default(25),
  uncertainty: float("uncertainty").default(8.3),
  player: int("player").notNull(),
});

export const matches = mysqlTable("matches", {
  id: serial("id").primaryKey(),
  createdAt: datetime("createdAt").notNull(), // No auto-date 'cause db-server timezone would be used
  enteredBy: int("enteredBy").notNull(),
});

export const playerMatches = mysqlTable("playerMatches", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["WON", "LOST"]).notNull(),
  match: int("match").notNull(),
  player: int("player").notNull(),
});

export const monthResult = mysqlTable("monthResult", {
  id: serial("id").primaryKey(),
  createdAt: date("createdAt").notNull().unique(),
  enteredBy: int("enteredBy").notNull(),
})

export const monthResultPlayers = mysqlTable("monthResultPlayers", {
  id: serial("id").primaryKey(),
  monthResult: int("monthResult").notNull(),
  player: int("player").notNull(),
  points: int("points").notNull(),
})

/**
 *  since planetScale can't use foreign key constraints, we have to define the relations manual
 *    1 User ---- (creates) ---- N Players
 *    1 Player -- (wins/looses) --- N PlayersMatch
 *    1 Match -- (hasPlayers) --- N PlayersMatch
 */
export const usersRelations = relations(users, ({ many }) => ({
  players: many(players),
}));

export const ratingRelations = relations(ratings, ({ one }) => ({
  player: one(players, {
    fields: [ratings.player],
    references: [players.rating],
  }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  user: one(users, {
    fields: [players.createdBy],
    references: [users.id],
  }),
  rating: one(ratings, {
    fields: [players.rating],
    references: [ratings.id],
  }),
  playerMatches: many(playerMatches, {relationName: "playerMatchesToPlayer" }),
  monthResultPlayers: many(monthResultPlayers, { relationName: "monthResultPlayerToPlayer" })
}));

export const playerMatchesRelations = relations(playerMatches, ({ one }) => ({
  player: one(players, {
    fields: [playerMatches.player],
    references: [players.id,],
    relationName: "playerMatchesToPlayer"
  }),
  matches: one(matches, {
    fields: [playerMatches.match],
    references: [matches.id],
    relationName: "playerMatchesToMatch"
  }),
}));

export const matchesRelations = relations(matches, ({ many }) => ({
  playerMatches: many(playerMatches, { relationName: "playerMatchesToMatch" }),
}));


export const monthResultRelations = relations(monthResult, ({ many }) => ({
  monthResultPlayers: many(monthResultPlayers, { relationName: "monthResultPlayerToMonthResult" }),
}))


export const monthResultPlayersRelations = relations(monthResultPlayers, ({ one }) => ({
  player: one(players, {
    fields: [monthResultPlayers.player],
    references: [players.id,],
    relationName: "monthResultPlayerToPlayer"
  }),
  monthResult: one(monthResult, {
    fields: [monthResultPlayers.monthResult],
    references: [monthResult.id],
    relationName: "monthResultPlayerToMonthResult"
  }),
}))