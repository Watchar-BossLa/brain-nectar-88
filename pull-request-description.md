# Add Multi-Subject Support to Study Bee

## Overview

This PR transforms Study Bee from a single-subject learning platform to a comprehensive multi-subject learning platform. It adds support for Mathematics, Physics, Chemistry, Data Science, and Finance, with dedicated pages, components, and services for each subject.

Additionally, it implements the first interactive component from our enhancement plans: the Interactive Graphing Calculator for the Mathematics subject.

## Key Changes

- **New Subject Pages**: Added dedicated pages for Mathematics, Physics, Chemistry, Data Science, and Finance
- **Subject Navigation**: Created a SubjectSelector component for easy navigation between subjects
- **Service Layer**: Added service files for each subject with mock data and API functions
- **Dashboard Update**: Updated the Dashboard to include the SubjectSelector
- **Documentation**: Updated the README.md to reflect the multi-subject nature of the app
- **Enhancement Plans**: Added detailed plans for future enhancements to each subject
- **Interactive Graphing Calculator**: Implemented the first interactive component from our enhancement plans
- **Unit Tests**: Added unit tests for the GraphingCalculator component
- **Test Plans**: Created comprehensive test plans for multi-subject functionality and the graphing calculator

## Testing

- Verified that all new pages load correctly
- Tested navigation between subjects using the SubjectSelector
- Confirmed that mock data is displayed correctly on each subject page
- Validated that all interactive elements are functional
- Added unit tests for the GraphingCalculator component
- Created comprehensive test plans for multi-subject functionality and the graphing calculator

## Screenshots

[Add screenshots of the new subject pages and the SubjectSelector component]

## Future Work

This PR also includes detailed enhancement plans for:
- Adding interactive elements to each subject
- Implementing real API calls to replace mock data
- Adding more subjects to the platform
- A master implementation plan with a timeline and resource requirements

These plans are located in the `enhancement-plans/` directory.

The next steps in the implementation plan are:
1. Implement the Interactive Mechanics Simulator for Physics
2. Implement the Interactive Periodic Table for Chemistry
3. Implement the Interactive Data Visualization Studio for Data Science
4. Implement the Interactive Investment Portfolio Simulator for Finance

## Related Issues

Closes #[issue-number]

## Checklist

- [x] Code follows the project's coding standards
- [x] Documentation has been updated
- [x] All tests pass
- [x] No new warnings or errors introduced
- [x] Enhancement plans have been created for future work
