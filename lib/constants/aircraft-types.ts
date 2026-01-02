export const AIRCRAFT_CATEGORIES = {
  JET: "jet",
  TURBOPROP: "turboprop",
  HELICOPTER: "helicopter",
  PISTON: "piston",
  TRAILER: "trailer",
} as const;

export type AircraftCategory = typeof AIRCRAFT_CATEGORIES[keyof typeof AIRCRAFT_CATEGORIES];

export const AIRCRAFT_STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
  PENDING: "pending",
  DRAFT: "draft",
} as const;

export type AircraftStatus = typeof AIRCRAFT_STATUS[keyof typeof AIRCRAFT_STATUS];

export const AIRCRAFT_CATEGORY_LABELS: Record<AircraftCategory, string> = {
  [AIRCRAFT_CATEGORIES.JET]: "Business Jet",
  [AIRCRAFT_CATEGORIES.TURBOPROP]: "Turboprop",
  [AIRCRAFT_CATEGORIES.HELICOPTER]: "Helicopter",
  [AIRCRAFT_CATEGORIES.PISTON]: "Piston Aircraft",
  [AIRCRAFT_CATEGORIES.TRAILER]: "Trailer",
};

export const AIRCRAFT_STATUS_LABELS: Record<AircraftStatus, string> = {
  [AIRCRAFT_STATUS.AVAILABLE]: "Available",
  [AIRCRAFT_STATUS.SOLD]: "Sold",
  [AIRCRAFT_STATUS.PENDING]: "Pending",
  [AIRCRAFT_STATUS.DRAFT]: "Draft",
};
