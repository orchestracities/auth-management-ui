# Auth Management UI Release Notes

## 0.9-dev

### New features

- Entities Paginations (#113)
- Table pagination && elements configurable by env
- Resource type pagination (#109)
- Policies Paginations (#127)
- Update apollo library to v4 (#136)
- Policy display on entity table (#118)
- Mongo auth (#153)
- Custom text home page (#125)

### Bug fixes

- Resource types on entities page

### Documentation

### Continuous Integration

- Update React to v18.2
- Update all the libraries to the latest version
- Replace the json editor with new library
- Rewrite the map component to mach leafleat v4

### Technical debt

## 0.8

### New features

- Form for the entity creation (#114)
- Form for the creation of attributes related to a entity (#114)
- Entity id validation (#148)
- Delete multiple entities (#115)

### Bug fixes

- Fixing the counter on the cards (#141)
- Fixing the Tenants not displayed if the initial config is not loaded (#138)
- Fixing documentation on filters (#131)
- Workaround on 100 policies limitation (waiting for a pagination on APIs)
- Fixing filter position and z-index

### Documentation

### Continuous Integration

### Technical debt

## 0.7

### New features

- Get the entities from the provided url (#111)
- Entities Filter with type/date/path (#112)
- Display the entities inside a table (#113)
- Organize side bar menu and translate menu items (#126)
- Basic home page with navigation info (#125)
- Reduce size of some graphical elements (e.g. topbar)
- Close side bar on navlink click (#132)
- Implement access control to pages / menus based on role / group
- Set-up logout link (#137)
- Set-up link to profile (#137)

### Bug fixes

- Fix git action test failure (#121)
- Fix misspelled translations
- Add missing delete tenant configuration on tenant delete (#123)

### Documentation

### Continuous Integration

- Add basic UI test  based on cypress (#4)

### Technical debt

## 0.6

### New features

- Add form for creating resource types
- Add support for retrieving resource id based
  on resource type endpoint in policy forms
- Update tests to use Node 16 (#93)
- Pass authorization token to policies calls
- Update configuration: orion query with filter, debug only in dev environment

### Bug fixes

- Fix fonts inside the policy table
- Policy form user mapping
- Fix environment variables loading for configuration-api
- Update security dependencies
- Remove hardcoded env file

### Documentation

### Continuous Integration

- Clean up dependencies
- Update to login-action@v2
- Add support for arm64 builds

### Technical debt

## 0.5

### New features

- Load values from Keycloak to populate users, groups and roles in policyForm
- Decouple components from the APIs
- Migration to orchestracities realm v0.0.6
- Refresh Token on the creation of a new Tenant

### Bug fixes

- Change the Group selector from name to path
- Fix filters top margin
- Fix filters naming
- Fix filter behavior when another tenant is selected
- Add OAuth Token on TenantDelete
- Display Tenant selector only if superAdmin
- Fix tenantPreferences creation issue when a new tenant is created

### Documentation

### Continuous Integration

### Technical debt

## 0.4

### New features

- Pass the token to the policy api
- The last tenant selected is loaded by default
- Add custom icons (with some size limitation) to your tenant
- Update repository to use v0.0.5 of keycloak scripts and realm export
- Allow tenantPage only if the user is a superAdmin
- Support configurable logging

### Bug fixes

- Small scaling of the lateral menu

### Documentation

### Continuous Integration

- Unit tests for the configuration api

### Technical debt

## 0.3

### New features

- Possibility to add N subpaths on the main form or on the table of services
- Proper responsive on the elements
- Fullscreen forms on mobile
- Fullscreen table and filters

### Bug fixes

- Using prestart we re-generate the env.js file,
  but the generator does not comply with our
  prettier rules, so we have to enforce prettier during pre-start.
- Changed some names on variables in order to be more clear
- Minor issues (animation/colors)
- Remove GraphQL requirement for the app to work
- Tenant name on path creation

### Documentation

### Continuous Integration

### Technical debt

## 0.2

### New features

- New animations
- New colors for the policies Cards
- Filter by resource in the policies table
- Modify a policy
- Manage errors in the policy forms
- Policy ID on edit
- Notification system for deleting, creating, updating elements

### Bug fixes

- Fix inside policies form the default path value
- Fix inside policies form a missing translation
- Changing translations inside the policies table
- Policy delete fix
- Fix misspelled Resource Tenant Agent urn
- Fix docker image for ui to load env variables dynamically
- Fix prettier to uniform code style

### Documentation

- Clean README.md
- Code of Conduct
- CONTRIBUTION guide

### Continuous Integration

- Markdown linter
- Docker build
- Release note check
- Templates for github issues
- Templates for github PRs
- CLA and CLA signature workflow

### Technical debt

- Refactor to provide more meaningful names and variables management

## 0.1

### New features

- Basic UI version and development environment

### Bug fixes

### Documentation

### Continuous Integration

### Technical debt
