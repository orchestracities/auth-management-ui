# Auth Management UI Release Notes

## 0.3-dev

### New features

- Possibility to add N subpaths
- Proper responsive on the elements
- Fullscreen forms on mobile
- Fullscrean table and filters

### Bug fixes

- Using prestart we re-generate the env.js file,
  but the generator does not comply with our
  prettier rules, so we have to enforce prettier during prestart.
- Minor issues (animation/colors)
- No Graphql dependencies for the app to work
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
- Managing errors in policyform
- Policy ID on edit
- Notification system for deleting,creating,updating elements

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
