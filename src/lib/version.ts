// Elghali AI - Version Info
// This file forces Vercel to rebuild with complete race data

export const VERSION = "2.0.0";
export const BUILD_DATE = "2026-02-22T12:00:00Z";
export const DATA_VERSION = "complete-v2";

// Race counts per track
export const RACE_COUNTS = {
  "Al Ain": {
    "2026-02-22": 10,
    total_horses: 45
  },
  "Meydan": {
    "2026-02-20": 8,
    total_horses: 32
  },
  "Jebel Ali": {
    "2026-02-21": 6,
    total_horses: 24
  },
  "Abu Dhabi": {
    "2026-02-27": 3,
    total_horses: 12
  }
};

// This ensures the latest race data is loaded
export const FORCE_REBUILD = true;
