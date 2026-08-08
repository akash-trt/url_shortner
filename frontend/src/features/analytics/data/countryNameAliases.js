/**
 * ip-api.com (used by the backend's geo lookup) returns common English
 * country names. The world-atlas topojson uses Natural Earth's short
 * names, which don't always match ("United States" vs "United States of
 * America"). This maps the former to the latter for the handful of
 * countries where they actually differ — everything else matches as-is.
 */
export const COUNTRY_NAME_ALIASES = {
  "United States": "United States of America",
  "USA": "United States of America",
  "Czech Republic": "Czechia",
  "Ivory Coast": "Côte d'Ivoire",
  "Cote d'Ivoire": "Côte d'Ivoire",
  "Democratic Republic of the Congo": "Dem. Rep. Congo",
  "DR Congo": "Dem. Rep. Congo",
  "Republic of the Congo": "Congo",
  "Congo (Kinshasa)": "Dem. Rep. Congo",
  "Congo (Brazzaville)": "Congo",
  "Bosnia and Herzegovina": "Bosnia and Herz.",
  "Dominican Republic": "Dominican Rep.",
  "Central African Republic": "Central African Rep.",
  "Equatorial Guinea": "Eq. Guinea",
  "South Sudan": "S. Sudan",
  "Eswatini": "eSwatini",
  "Swaziland": "eSwatini",
  "Western Sahara": "W. Sahara",
  "Solomon Islands": "Solomon Is.",
  "North Macedonia": "Macedonia",
  "Myanmar (Burma)": "Myanmar",
  "Burma": "Myanmar",
  "Republic of Korea": "South Korea",
  "Korea, Republic of": "South Korea",
  "Korea, Democratic People's Republic of": "North Korea",
  "Falkland Islands (Malvinas)": "Falkland Is.",
  "French Southern Territories": "Fr. S. Antarctic Lands",
  "State of Palestine": "Palestine",
  "Timor Leste": "Timor-Leste",
  "East Timor": "Timor-Leste",
  "Trinidad & Tobago": "Trinidad and Tobago",
};
