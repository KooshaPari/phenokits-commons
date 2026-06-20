# Runtime libs removed from phenokits-commons

Date: 2026-06-20

`phenokits-commons` was acting as a broad runtime-library aggregate. This cleanup removes runtime package directories after their source-loss risk was closed through PhenoKits absorption work.

| Removed surface | Evidence of absorption/preservation | Status |
|---|---|---|
| `libs/go/*` | `phenotype-go-sdk#21` merged | `DONE` |
| `libs/python/phenokit-config-kit` | `phenotype-python-sdk#28` merged | `DONE` |
| other `libs/python/*` | file-equivalent packages already existed in `phenotype-python-sdk` | `SUPERSEDED_PARITY` |
| `libs/typescript/*` | preserved in `phenotype-registry/docs/absorption/PhenoKits/typescript-preservation/` | `LAST_RESORT_EXCEPTION` preserved |

Decision: keep `phenokits-commons` only for governance/templates/policies/docs/shared artifact patterns, not runtime packages.
