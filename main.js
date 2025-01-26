// main.js

// We are going to use the bootstrap 12-col grid
// https://getbootstrap.com/docs/5.3/layout/grid/
//
// (1) Define the columns in terms of a 12-col grid (must add to 12)
//
// examples:
// - [8, 4]     // 2 columns with a wide left side and a thinner right side
// - [4, 4, 4]  // 3 equal columns
//
var columns = [4, 4, 4];

// (2) Define the widgets
//
// The widget object is just a simple object that looks like the following
//
// {
//   id: 'unique-name',
//   title: 'Widget Name',          // optional
//   column: 0,                     // column index based on the definition above
//   y: 1,                          // default row position
//   type: 'list',                  // or 'tile'
//   icon: 'fa-regular fa-dot',     // any icon font that you have included
// }
//
var widgets = [
    // (1.1) Left side column
    { id: 'sales', title: 'Reservations', icon: 'fa-thin fa-table-list', },
];

//console.log(widgets);
// (2) Loop through each widget
// widgets.forEach((obj, index) => {
//     // (2.1) Set the "default" height of a widget if list
//     var height = null;
//     if (widgets[index].type == 'list') {
//         height = HEIGHT_SM;
//     }
//     // (2.2) Add the rest of the properties into the widget
//     widgets[index] = { ...obj, height, visible: true, color: '#007ac1', };
// });
//console.log(widgets);
// (3) Push them a layout object
// var layout = {
//     metadata: null,
//     widgets,
//     theme: 'light',
//     gridSize: { columns: 12, rows: null, },
// }

// initialize the dashboard
var d = dashboard.initialize({
    // container: '#div-dashboard',
    // widgets,
    // columns,
    // refresh: 300,   // in seconds
});
