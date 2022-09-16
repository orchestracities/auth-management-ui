# Auth Management UI Release Notes

## 0.4

### New features

- The token is also passed to the policies

### Bug fixes

### Documentation

### Continuous Integration

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
