# Model Mapping Change - AutoMapper to Mapster

## Status

> Accepted

> April 15, 2020

## Context

The current model mapping library [AutoMapper](https://automapper.org/) ([GitHub](https://github.com/AutoMapper/AutoMapper)) requires a lot of effort to configure.
It is near impossible to debug.
It is not intuitive to develop with.
The benefits and features it offers are far outweighed by the time invested in implementation and maintenance.

A new library is required to speed up development and improve the debugging experience.

## Decision

[Mapster](https://github.com/MapsterMapper/Mapster/wiki) ([source](https://github.com/MapsterMapper/Mapster)) provides a more intuitive solution, along with performance benefits.

## Consequences

The industry adoption of AutoMapper is much higher than Mapster.
AutoMapper has more features available (although irrelevant at this point in time).

Mapster is far more intuitive when developing.
It is far better in performance.
It can be debugged, and provides better error handling.
The structure is similar enough to AutoMapper that the learning curve is minimal.
However global configuration appears to be more challenging when used with Dependency Injection.
