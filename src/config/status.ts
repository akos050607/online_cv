export type Status = 'built' | 'planned';

/**
 * One entry per capability. 'built' renders as running infrastructure
 * in the past tense with measured numbers. 'planned' renders as a dated
 * build plan in the future tense. Nothing is ever hidden — promoting an
 * item means changing 'planned' to 'built' here and pasting in the
 * measurements. Nowhere else.
 */
export const STATUS: Record<string, Status> = {
  k3s:           'built',    // hybrid cluster, Tailscale, HPA — March 2026
  chaos:         'built',    // the sleep incident
  cicd:          'built',    // this site deploys itself on push to main
  terraform:     'planned',
  ingress:       'planned',
  observability: 'planned',
  keycloak:      'planned',
  webauthn:      'planned',
  azure:         'planned',
};

export const SHIP_DATES: Record<string, string> = {
  terraform: '5 Aug', ingress: '7 Aug', keycloak: '8 Aug',
  webauthn: '8 Aug', observability: '9 Aug', azure: '9 Aug',
};

/** 90-second demo. Renders nothing at all while null. */
export const VIDEO_URL: string | null = null;

/* ------------------------------------------------------------------ *
 * Derived below this line. Nothing here is a source of truth — it all
 * reads out of STATUS and SHIP_DATES so the page can never disagree
 * with them.
 * ------------------------------------------------------------------ */

/** The year SHIP_DATES belongs to. Used only for formatting. */
export const SHIP_YEAR = 2026;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const parseShipDate = (value: string): Date => {
  const [day, month] = value.split(' ');
  return new Date(SHIP_YEAR, MONTHS.indexOf(month), Number(day));
};

/** '5 Aug' -> '08-05'. The stamp form used in the architecture diagram. */
export const shipStamp = (key: string): string => {
  const date = parseShipDate(SHIP_DATES[key]);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}-${String(date.getDate()).padStart(2, '0')}`;
};

/** '9 Aug' -> 'Sun 9 Aug'. The prose form used in body copy and chips. */
export const shipLabel = (key: string): string =>
  `${WEEKDAYS[parseShipDate(SHIP_DATES[key]).getDay()]} ${SHIP_DATES[key]}`;

export const BUILT_COUNT = Object.values(STATUS).filter((s) => s === 'built').length;
export const TOTAL_COUNT = Object.keys(STATUS).length;

/** Latest date still outstanding, e.g. 'Sun 9 Aug'. Null once nothing is planned. */
export const LAST_SHIP_LABEL: string | null = (() => {
  const outstanding = Object.keys(SHIP_DATES).filter((k) => STATUS[k] === 'planned');
  if (outstanding.length === 0) return null;
  return shipLabel(
    outstanding.reduce((a, b) =>
      parseShipDate(SHIP_DATES[a]) >= parseShipDate(SHIP_DATES[b]) ? a : b,
    ),
  );
})();
