import { z } from "zod";

const PLAYER_MATCH_BACKUP_KEY = "playerMatches";

const OfflinePlayerMatchesSchema = z.array(
  z.object({
    player: z.number(),
    displayName: z.string(),
    timestamp: z.coerce.date(),
  })
);

export type OfflineMatch = z.output<typeof OfflinePlayerMatchesSchema>[0];

function getOfflineMatches(): OfflineMatch[] | undefined {
  try {
    const offlineMatchJSON = localStorage.getItem(PLAYER_MATCH_BACKUP_KEY);
    if (!offlineMatchJSON) return undefined;
    const { data, error } = OfflinePlayerMatchesSchema.safeParse(
      JSON.parse(offlineMatchJSON)
    );
    if (data) {
      return data;
    } else {
      console.error("Error parsing offline matches", error.message);
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
}

export const useOfflineActions = () => {
  function writeOfflineMatches(matches: OfflineMatch[]) {
    localStorage.setItem(PLAYER_MATCH_BACKUP_KEY, JSON.stringify(matches));
  }

  function addOfflineMatch(match: OfflineMatch) {
    const offlineMatches = getOfflineMatches() || [];
    writeOfflineMatches([...offlineMatches, match]);
  }

  function removeOfflineMatch(match: OfflineMatch) {
    const offlineMatches = getOfflineMatches() || [];
    const newOfflineMatches = offlineMatches.filter(
      (offlineMatch) => offlineMatch == match
    );
    writeOfflineMatches(newOfflineMatches);
  }

  const offlineMatches = getOfflineMatches();

  return {
    offlineMatches,
    writeOfflineMatches,
    addOfflineMatch,
    removeOfflineMatch,
  };
};
