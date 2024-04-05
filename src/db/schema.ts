import { relations } from "drizzle-orm";

import {pgTable ,timestamp, integer, pgEnum, serial, text, real } from "drizzle-orm/pg-core"

/* 

Users are not in implementation scope for now, but can be implemented later. 
Currently the plan is, to have one default user, which is used to create all player entries.

*/
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull()
});

/**
 * Players are the actual players.
 */
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  createdAt: timestamp("createdAt").notNull(),
  createdBy: integer("createdBy").notNull(),
  rating: integer("rating"),
  priority: integer("priority").notNull().default(9999),

});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  averageSkill: real("averageSkill").default(25),
  uncertainty: real("uncertainty").default(8.3),
  player: integer("player").notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(), // No auto-date 'cause db-server timezone would be used
  enteredBy: integer("enteredBy").notNull(),
});
export const wonLostEnum = pgEnum("type", ["WON", "LOST"])

export const playerMatches = pgTable("playerMatches", {
  id: serial("id").primaryKey(),
  type: wonLostEnum("type"),
  match: integer("match").notNull(),
  player: integer("player").notNull(),
});

export const monthResult = pgTable("monthResult", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().unique(),
  enteredBy: integer("enteredBy").notNull(),
})

export const monthResultPlayers = pgTable("monthResultPlayers", {
  id: serial("id").primaryKey(),
  monthResult: integer("monthResult").notNull(),
  player: integer("player").notNull(),
  points: integer("points").notNull(),
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