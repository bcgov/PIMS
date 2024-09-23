# Property Inventory Management System (PIMS)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

PIMS offers an inventory management system that supports the Strategic Real Estate Services (SRES) branch of the Real Property Division (RPD) in managing and overseeing the disposal of assets surplus to government. It aids staff in optimizing the benefits of managing public real-estate assets for government and BC citizens, and aims to be a trusted source for accurate information on government-owned titled property.

The system supports the management of titled properties through the government property ownership life cycle from acquisition to disposal (transfer to another ministry or sale outside of the government). This includes the ability to manage internal workflows. PIMS assists with the collection, analysis, and reporting of spatial data and related asset information from multiple data sources.

## Why PIMS?

Strategic Real Estate Services (SRES), comprised of professionals from a variety of backgrounds (sales, marketing, First Nations consultation, environmental management and communications) was formed to dispose of assets surplus to government in order to help government meet its commitment to balance the provincial budget and to generate economic activity in communities throughout BC. The SRES team is tasked with coordinating the province-wide management of this initiative, ensuring that all issues are addressed appropriately and that the return to government is maximized.

SRES is responsible for:

- Maintaining a complete inventory of the Province’s real estate assets
- Tracking Ministry organizations' compliance with policies related to disposition of real-estate assets
- Marketing property internally for repurposing (transfer to another ministry)
- Oversight of sales process from pre-marketing to completion
- First Nations Consultation on real estate development and dispositions
- Providing strategic real estate analysis and advice to ministries and broader public sectors
- Reporting to Treasury Board

To support SRES’s overall strategic real estate initiatives, a modern Inventory Management System was required that would aid in strategic decision making, support its client ministries and the Broader Public Sector, and remain compliant with current Inventory Policies (CPPM Policy Chapter 8: Asset Management). The system must be flexible to allow for ad hoc customized reporting and adaptable to support unforeseen future real-estate strategies.

## Documentation

All public-facing documentation is found in the [GitHub Wiki](https://github.com/bcgov/PIMS/wiki). Here are some common pages you may want to visit:

- [Development](https://github.com/bcgov/PIMS/wiki/Development)
- [Glossary](https://github.com/bcgov/PIMS/wiki/Glossary)
- [PIMS Team](https://github.com/bcgov/PIMS/wiki/PIMS-Development-Team)

## Report an Issue

Having issues with PIMS? See a problem in the GitHub repository?

Report your issue using the [Issues](https://github.com/bcgov/PIMS/issues/new/choose) page. Fill out the form and report your findings to help improve PIMS.

## Development

PIMS is primarily in its maintenance phase. Security and stability updates will continue to be addressed, but additional features are not actively being developed.

If you need to start an instance of PIMS on your local machine, see the [Development](https://github.com/bcgov/PIMS/wiki/Development) page.

## Directory

| Item | Description |
| --- | --- |
|`.github`| Files related to GitHub. Includes workflows, templates, etc. |
|`database`| Files related to PostgreSQL. May include documentation aids and database-related scripts. |
|`express-api`| The Express API for PIMS. |
|`react-app`|The React/Vite frontend for PIMS.|
|`tools`| Manually run scripts, security tools, etc.|
|`.codeclimate.yml`| Configuration file for Code Climate checks.|
|`.env-template`| The template file for locally created `.env` files.|
|`.gitignore`|File that defines exclusions for git tracking.|
|`.gitattributes`|Defines end of line requirements for files.|
|`CODE_OF_CONDUCT.md`| A set of standards and guidelines for contributors to PIMS.|
|`COMPLIANCE.yaml`|Recording of PIA and STRA dates.|
|`LICENSE`|The Apache 2.0 license documentation.|
|`README.md`|The README file containing this information.|
|`docker-compose.yml`|A Docker compose file that creates containers for the PIMS application. |

## License

```md
Copyright 2024 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
