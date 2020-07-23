# Notifications - Email Service

## Status

> Accepted

> June 16, 2020

## Context

PIMS requires a way to send email notifications to agencies throughout the workflow of disposing properties.

Use Cases;

- Whitelist of agencies who will receive emails
- Inform all agencies of a new properties in the Enhanced Referral Program (ERP)
- A way for agencies to show interest, or to opt out of further notifications
- Inform all agencies of status change or progress of properties in ERP
- Inform owning agency of status change of disposal project
- Notify owning agency of requirement or information

The **Common Hosted Email Service (CHES)** is a free service offered and supported by the **Exchange Lab**.

Additional Information here;

- [Common Services Showcase](https://bcgov.github.io/common-service-showcase/)
- [Common Hosted Email Service](https://bcgov.github.io/common-service-showcase/#CHES)
- [GetOk](https://getok.pathfinder.gov.bc.ca/getok/about)
- [GetOk - PIMS](https://getok.pathfinder.gov.bc.ca/getok/apps/PIMS)
- [ReDoc](https://ches-master-9f0fbe-prod.pathfinder.gov.bc.ca/api/v1/docs)
- [GitHub](https://github.com/bcgov/common-hosted-email-service)

## Decision

The decision is to integrate with the **CHES** or to continue looking for another solution to provide notification emails.

The key features **CHES** has are;

- Send emails with attachments and special business tagging
- Schedule for delayed delivery, with ability to cancel
- Create bulk email merge with your own templates.
- Send plain text or HTML emails
- Track the status of your request

In addition to integrating with **CHES** it will require developing the following features within PIMS;

- Maintain a list of `txId` and `msgId` so that messages can be tracked and cancelled if required.
- Notifications are `async` which will require design/workflow that handles failures.
- Manage a collection of templates that will be used for messages.

## Consequences

The primary benefit of integrating with **CHES** is that we don't have to support or build an email notification solution.
Additionally **CHES** is supported and used by other projects with the Lab, which means internal support and knowledge sharing.

Some of the consequences would/might be;

- No SLA
- No UI application to support
