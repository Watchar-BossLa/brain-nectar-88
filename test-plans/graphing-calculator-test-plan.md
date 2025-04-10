# Interactive Graphing Calculator Test Plan

## Overview

This test plan outlines the testing procedures for the Interactive Graphing Calculator component in the Mathematics section of the Study Bee platform.

## Test Environment

- **Browser**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Tablet, Mobile
- **Screen Sizes**: Small (< 768px), Medium (768px - 1024px), Large (> 1024px)

## Test Cases

### 1. Component Rendering

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TC-GC-001 | Verify that the GraphingCalculator component renders correctly | 1. Navigate to the Mathematics page<br>2. Click on the "Tools" tab<br>3. Click on "Open Calculator" for the Graphing Calculator | The GraphingCalculator modal should open and display the calculator interface with function input, graph area, and controls |
| TC-GC-002 | Verify that the calculator is responsive | 1. Open the GraphingCalculator on different screen sizes | The calculator should adjust its layout based on the screen size |

### 2. Function Input

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TC-GC-003 | Add a valid function | 1. Enter "x^2" in the function input field | The function should be plotted on the graph |
| TC-GC-004 | Add multiple functions | 1. Enter "x^2" in the first function input field<br>2. Click "Add Function"<br>3. Enter "sin(x)" in the second function input field | Both functions should be plotted on the graph with different colors |
| TC-GC-005 | Enter an invalid function | 1. Enter "x+" in the function input field | An error message should be displayed, and no graph should be plotted for this function |
| TC-GC-006 | Toggle function visibility | 1. Enter "x^2" in the function input field<br>2. Click the eye icon | The function should be hidden from the graph when the eye is closed and visible when the eye is open |
| TC-GC-007 | Change function color | 1. Enter "x^2" in the function input field<br>2. Click on the color picker<br>3. Select a new color | The function should be plotted with the new color |
| TC-GC-008 | Remove a function | 1. Add multiple functions<br>2. Click the trash icon for one of the functions | The selected function should be removed from the list and the graph |

### 3. Graph Controls

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TC-GC-009 | Change X and Y ranges | 1. Enter new values for X Min, X Max, Y Min, Y Max<br>2. Click "Apply Ranges" | The graph should update to show the new ranges |
| TC-GC-010 | Change grid size | 1. Adjust the grid size slider | The grid lines on the graph should update to reflect the new grid size |
| TC-GC-011 | Zoom in | 1. Click the "Zoom In" button | The graph should zoom in, showing a smaller range of values |
| TC-GC-012 | Zoom out | 1. Click the "Zoom Out" button | The graph should zoom out, showing a larger range of values |
| TC-GC-013 | Reset graph | 1. Change ranges and grid size<br>2. Click the "Reset" button | The graph should reset to the default ranges (-10 to 10 for both X and Y) and grid size |

### 4. Graph Rendering

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TC-GC-014 | Verify graph axes | 1. Open the calculator with default ranges | The X and Y axes should be visible on the graph |
| TC-GC-015 | Verify grid lines | 1. Open the calculator with default grid size | Grid lines should be visible on the graph |
| TC-GC-016 | Verify function plotting | 1. Enter various functions (e.g., "x^2", "sin(x)", "1/x") | Each function should be plotted correctly according to its mathematical definition |
| TC-GC-017 | Verify handling of discontinuities | 1. Enter a function with discontinuities (e.g., "1/x") | The function should be plotted correctly, with gaps at the discontinuities |

### 5. Additional Features

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|----------------|
| TC-GC-018 | Download graph | 1. Plot one or more functions<br>2. Click the "Download" button | The graph should be downloaded as a PNG image |
| TC-GC-019 | Close calculator | 1. Open the calculator<br>2. Click the close button (X) | The calculator modal should close and return to the Mathematics page |

## Test Data

### Functions to Test

- Simple polynomials: "x^2", "x^3 - 2*x"
- Trigonometric functions: "sin(x)", "cos(x)", "tan(x)"
- Exponential and logarithmic: "exp(x)", "log(x)"
- Rational functions: "1/x", "x/(x^2-1)"
- Piecewise functions: "x < 0 ? -x : x"
- Invalid expressions: "x+", "sin(", "1/0"

### Range Values to Test

- Default: X: [-10, 10], Y: [-10, 10]
- Small range: X: [-1, 1], Y: [-1, 1]
- Large range: X: [-100, 100], Y: [-100, 100]
- Negative range: X: [-20, -10], Y: [-20, -10]
- Mixed range: X: [-10, 10], Y: [0, 20]

## Defect Reporting

For any defects found during testing, please include:

1. Test ID
2. Environment (browser, device, screen size)
3. Steps to reproduce
4. Expected result
5. Actual result
6. Screenshots or videos if applicable

## Test Execution

| Test ID | Status | Defects | Notes |
|---------|--------|---------|-------|
| TC-GC-001 | Not Started | | |
| TC-GC-002 | Not Started | | |
| TC-GC-003 | Not Started | | |
| TC-GC-004 | Not Started | | |
| TC-GC-005 | Not Started | | |
| TC-GC-006 | Not Started | | |
| TC-GC-007 | Not Started | | |
| TC-GC-008 | Not Started | | |
| TC-GC-009 | Not Started | | |
| TC-GC-010 | Not Started | | |
| TC-GC-011 | Not Started | | |
| TC-GC-012 | Not Started | | |
| TC-GC-013 | Not Started | | |
| TC-GC-014 | Not Started | | |
| TC-GC-015 | Not Started | | |
| TC-GC-016 | Not Started | | |
| TC-GC-017 | Not Started | | |
| TC-GC-018 | Not Started | | |
| TC-GC-019 | Not Started | | |
