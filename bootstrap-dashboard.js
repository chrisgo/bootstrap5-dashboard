/**
 * Dashboard module
 * 
 * For now, we are going to focus on developing a 2-column dashboard
 * that splits the screen into 2/3 left (col-md-8) and 1/3 right (col-md-4) so 
 * we don't have to work too hard to make everything work perfect
 * At some point we can maybe even do 1 more update where the 2/3 left column 
 * can split into 2 more columns creating a 3-column layout (not sure how to do this yet)
 * 
 */

var dashboard = (function () {

    /**
     * Prefix for key
     */
    var CACHE_KEY = 'dashboard.layout';

    /**
     * Config
     */
    var config;

    /**
     * Defaults for the configuration
     */
    var defaults = {
        container: '#div-dashboard',
        widgets: [{id: 'left'}, {id: 'right'}],
        columns: [8, 4],
        refresh: 300,
        debug: false,
        fluid: false,
        greeting: 'Dashboarder',
    };

    /**
     * Initialize
     */
    function initialize(c) {
        // (1) Cleanup the config that is passed in and merge with the defaults
        var _config = { ...defaults };
        for (var key in defaults) {
            if (key in c) {
                _config[key] = c[key];
            }
        }
        // (1.1) Set the config back as the final config object
        config = _config;
        // (2) Validate 
        // (2.1) Make sure we have a container
        if (! $(config.container).length) {
            var error = `Dashboard container not found, need <div id="${config.container}"></div> in the html`;
            console.error(error);
            if (config.debug) { alert(error); }
            return;
        }
        // (2.2) Make sure the columns add up to 12 




        render();
    }

    /**
     * Render
     */
    function render() {
        // (1) Render the container
        // (1.1) Container class
        var container = config.fluid ? 'container-fluid' : 'container';
        // (1.2) Columns
        // <div id="div-sortable-0" class="col-8"></div>
        var columnHtml = []; // 
        for (let ii = 0; ii < config.columns.length; ii++) {
            columnHtml.push(`<div id="sortable-${ii}" class="col-${config.columns[ii]}"></div>`);
        }
        // (1.3) Greeting 
        var greetingHtml = `<div class="row mb-1"><div id="greeting" class="col-8"></div><div id="controls" class="col-4 text-end"></div></div>`;
        // (1.3) Render the container
        $(config.container).html(`<div class="${container}">${greetingHtml}<div class="row">${columnHtml.join("")}</div></div>`);
        // (2) Handle the sortables 
        // (2.1) Setup the sortables configuration
        var sortable = {
            // deactivate: function(event, ui) {
            //     // Get the child div id="..."
            //     ui.item.find('div').attr('id');
            //     var sortedItems = $('#div-sortable-right').sortable('toArray', { attribute: 'div.id' }); 
            //     console.log(sortedItems); 
            // },
            update: function () {
                // var updates = {};
                // var counter = 0;
                // $('#div-sortable-right .sortable-item').each(function (index) {
                //     var childDiv = $(this).find('div'); // .attr('id');
                //     var id = childDiv.attr('id').replace('div-widget-', '');
                //     //console.log(`Item ${index + 1}: Child div ID = ${childId}`);
                //     var checkbox = $(this).find('input[type="checkbox"][name="show"]'); // :is(':checked');
                //     updates[id] = counter;
                //     counter++;
                // });
                // //console.log(updates);
                // dashboard.update('y', updates);
            }
        };
        for (let ii = 0; ii < config.columns.length; ii++) {
            // (2.1) Create the sortables
            $(config.container + ' #sortable-' + ii).sortable(sortable);
            // (2.2) Disable the sortables
            $(config.container + ' #sortable-' + ii).sortable('disable');
        }
        // (3) Render greeting
        $(config.container + ' #greeting').html(greeting(config.greeting));
        // (4) Render controls


    }

    /**
     * Render controls
     */
    function controls(name) {

    }

    /**
     * Display greeting
     */
    function greeting(name) {
        // (1) Get the date
        var currentHour = new Date().getHours();
        // (2) Determine the greeting
        var greeting;
        if (currentHour >= 12 && currentHour < 18) {
            greeting = "Good Afternoon";
        } else if (currentHour < 12) {
            greeting = "Good Morning";
        } else {
            greeting = "Good Evening";
        }
        // (3) If we get a name
        if (name) {
            greeting = greeting + ", " + name
        }
        // (4) Add the "exclamation"
        greeting = greeting + '!';
        // (5) 1/7/25 CG: Add some wrappers around the greeting, not sure if this is the correct place
        var html = `
            <div style="font-family: sans-serif; text-transform: none; text-transform: none; font-size: 1.8rem; margin-bottom: 8px;">
                ${greeting}
            </div>
        `;
        //$(element).html(html);
        return html;
    }


    // define the public module
    var d = {};
    d.initialize = initialize;
    d.render = render;
    // d.refresh = refresh;
    // d.timer = timer;
    // d.tile = tile;
    // d.tiles = tiles;
    // d.colorize = colorize;
    // d._default = _default;
    // d.load = load;
    // d.save = save;
    // d.reset = reset;
    // d.update = update;
    // d.customize = customize;
    // d.sync = sync;
    d.greeting = greeting;
    d.controls = controls;
    return d;

}());