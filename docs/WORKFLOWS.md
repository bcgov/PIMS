# Light Workflow Engine

The Light Workflow Engine provides a simple way to manage the lifecycle of a project, while provide a degree of flexibility with customization and future changes.

Additionally as the solution expands new workflows can be created and changes can be dynamically made to alter existing workflows.

## Project Status

At the heart of the workflows is a collection of status (or stages).
These represent steps that can or must be performed before a project can continue to another status.
Each status can be mapped to allow for transition to any other status, thus enabling a way to ensure consistent workflow.

## Milestones

A milestone represents a critical process in a workflow.
A project status can be marked as a milestone.
When a project status is identified as a milestone it enforces the requirement to only be updated through the workflow engine endpoint.
Other minor status can be changed through normal CRUD operations.

Milestones are commonly used to transition from one workflow into another.
But this is not a requirement.

Milestones can include additional business logic that has been coded into the workflow engine.

## Project Tasks

Tasks provide essentially a checklist of activities that need to be performed.

Tasks are generally linked to a project status, but are not required to be.
This provides a way to identify a checklist of activities for each status that should be performed before moving onto the next status.

## Workflows

There are currently two workflows;

- [Submit Surplus Property Process Project](./sres/SUBMIT-DISPOSAL.md)
- [Assess Surplus Property Process Project Request](./sres/ASSESS-DISPOSAL.md)
