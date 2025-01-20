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
     * Default height in pixels "small"
     */
    var HEIGHT_SM = '300px';

    /**
     * Height for "medium"
     */
    var HEIGHT_MD = '500px';

    /**
     * Height for "large"
     * 1/5/25 CG: This is set to blank to stretch all the way (no max-length, no overflow)
     */
    var HEIGHT_LG = '';

    /**
     * Return the initial layout if we cannot find anything in localStorage
     * so that we have a place to edit the default layout and if we want to reset
     * everything and start over
     * 
     * 12/31/24 CG: Not yet used
     */
    function initialize() {
        //console.log('initialize()');
        // (1) Create the sortable options
        var sortable = {
            // deactivate: function(event, ui) {
            //     // Get the child div id="..."
            //     ui.item.find('div').attr('id');
            //     var sortedItems = $('#div-sortable-right').sortable('toArray', { attribute: 'div.id' }); 
            //     console.log(sortedItems); 
            // },
            update: function () {
                var updates = {};
                var counter = 0;
                $('#div-sortable-right .sortable-item').each(function (index) {
                    var childDiv = $(this).find('div'); // .attr('id');
                    var id = childDiv.attr('id').replace('div-widget-', '');
                    //console.log(`Item ${index + 1}: Child div ID = ${childId}`);
                    var checkbox = $(this).find('input[type="checkbox"][name="show"]'); // :is(':checked');
                    updates[id] = counter;
                    counter++;
                });
                //console.log(updates);
                dashboard.update('y', updates);
            }
        };
        // (2) Create the sortables
        $('#div-sortable-left').sortable(sortable);
        $('#div-sortable-right').sortable(sortable);
        // (3) Disable the sorters 
        $('#div-sortable-left').sortable('disable');
        $('#div-sortable-right').sortable('disable');
        // (4) Render the dashboard
        render();
        timer();
    }

    /**
     * Render
     */
    function render(all = false) {
        //console.log('render()');
        // (1) Load widget
        var { widgets } = load();
        //console.log(widgets);
        // (2) Clear the lists
        //console.log('ALL ? ' + all);
        $('#div-sortable-left').html('');
        $('#div-sortable-right').html('');
        // (3) Loop through and populate the right side
        widgets.forEach(widget => {
            //console.log(widget);
            // if (widget.visible && $('#div-widget-' + widget.id).length) {
            //     var _widget = widget.id.replaceAll('-', '_');
            //     $('#div-widget-' + widget.id).load('/manager/home/' + _widget);
            // }
            if (! widget.visible && ! all) {
                //console.log(widget.id + ' => not visible, skip ...');
                return;
            }
            var html = `
                <div class="tab-card py-1 sortable-item">
                    <div id="div-widget-${widget.id}" class="widget" data-x="${widget.x}" data-y="${widget.y}" data-width="${widget.width}" data-height="${widget.height}">
                        <div class="d-flex d-none widget-control py-1" style="display:none;">
                            <div class="me-2">
                                <i class="fa-solid fa-grip text-silver"></i>
                                <span class="text-concrete" style="font-size:0.7rem;">Drag to Sort</span>
                            </div> 
                            <div class="me-2" style="margin-top:2px;">
                                <div class="checkbox checkbox-slider--b-flat checkbox-slider-sm" style="margin-top:2px; margin-bottom:0px;">
                                    <label style="padding-left:0px;">
                                        <input type="checkbox" 
                                            id="field-show" 
                                            name="show" 
                                            value="1" 
                                            data-id="${widget.id}"
                                            class="widget-toggle-visible"
                                            ${widget.visible ? 'checked="checked"' : ''}><span>&nbsp;<span class="text-concrete" style="font-size:0.7rem;">Show</span></span>
                                    </label>
                                </div>
                            </div>
                            <div class="me-2" style="margin-top:2px;">
                                <div class="input-group colorpicker-control" style="margin-top:1px;">
                                    <input type="hidden" id="${widget.id}" value="${widget.color}"/>
                                    <span class="input-group-append">
                                        <span class="input-group-text colorpicker-input-addon" style="padding:0; max-height:12px; overflow:hidden;"><i></i></span>
                                    </span>
                                    &nbsp;<span class="text-concrete" style="font-size:0.7rem;">Color</span></span>
                                </div>
                            </div>
                            <div class="me-1" style="margin-top:0px; ${widget.type == 'list' ? '' : 'display:none;' }">
                                <div class="btn-group" role="group">
                                    <input 
                                        name="${widget.id}-height" 
                                        id="field-${widget.id}-height-${HEIGHT_SM}" 
                                        data-id="${widget.id}"
                                        value="${HEIGHT_SM}" 
                                        title="Max height ${HEIGHT_SM}" 
                                        ${widget.height == HEIGHT_SM ? 'checked="checked"' : ''}
                                        type="radio" 
                                        class="btn-check required widget-toggle-height" 
                                        autocomplete="off">                    
                                    <label 
                                        for="field-${widget.id}-height-${HEIGHT_SM}"
                                        class="btn btn-outline-silver rounded-0 p-0 m-0" 
                                        style="height:12px; line-height:0; width:22px;"><span style="font-size:1rem;"><b>.</b></span></label>
                                    <input 
                                        name="${widget.id}-height"
                                        id="field-${widget.id}-height-${HEIGHT_MD}" 
                                        data-id="${widget.id}"
                                        value="${HEIGHT_MD}" 
                                        title="Max height ${HEIGHT_MD}" 
                                        ${widget.height == HEIGHT_MD ? 'checked="checked"' : ''}
                                        type="radio" 
                                        class="btn-check required widget-toggle-height" 
                                        autocomplete="off">                    
                                    <label 
                                        for="field-${widget.id}-height-${HEIGHT_MD}"
                                        class="btn btn-outline-silver rounded-0 p-0 m-0" 
                                        style="height:12px; line-height:0; width:22px;"><span style="font-size:1rem;"><b>..</b></span></label>                    
                                    <input 
                                        name="${widget.id}-height" 
                                        id="field-${widget.id}-height-${HEIGHT_LG}" 
                                        data-id="${widget.id}"
                                        value="${HEIGHT_LG}" 
                                        ${widget.height == HEIGHT_LG ? 'checked="checked"' : ''}
                                        title="Stretch Full Height" 
                                        type="radio" 
                                        class="btn-check required widget-toggle-height" 
                                        autocomplete="off">                    
                                    <label 
                                        for="field-${widget.id}-height-${HEIGHT_LG}"
                                        class="btn btn-outline-silver rounded-0 p-0 m-0" 
                                        style="height:12px; line-height:0; width:22px;"><span style="font-size:1rem;"><b>...</b></span></label>                
                                </div>
                            </div>
                            <div class="me-2" style="margin-top:1px; ${widget.type == 'list' ? '' : 'display:none;' }">
                                <span class="text-concrete" style="margin-top:2px; font-size:0.7rem;"><i class="fa-solid fa-up-down text-silver"></i> Height</span></span>
                            </div>
                        </div>
                    </div>
                    <h1 style="margin-top:4px;">
                        <i class="${widget.icon || 'fa-thin fa-circle-dot'} fa-fw" style="color: ${widget.color};"></i> ${widget.title}
                    </h1>
                    <div id="widget-${widget.id}" class="mb-2 ${widget.height ? 'scrollable-container' : ''}" style="max-height: ${widget.height || 'none'};"><div class="p-3"><div class="spinner"></div></div></div>
                </div>
            `;
            // <div id="widget-${widget.id}" style="min-height:50px; max-height:200px; overflow:auto;"><div class="text-center"><i class="fa-solid fa-ellipsis fa-2x fa-beat text-silver" style="--fa-animation-duration: 0.5s;"></i></div></div>
            // Figure out if we are left side or right side 
            if (widget.x == 0) {
                $('#div-sortable-left').append(html);
            } else if (widget.x == 9) {
                $('#div-sortable-right').append(html);
            }
        });
        // (4) Call refresh
        refresh();
    }

    /**
     * Refresh the widgets
     */
    function refresh() {
        //console.log('refresh()');
        // (1) Load the widget
        var { widgets } = load();
        // (2) Loop through 
        widgets.forEach(widget => {
            if ($('#div-widget-' + widget.id).length) {
                //console.log(`loading... ${widget.id}`);
                var _widget = widget.id.replaceAll('-', '_');
                $('#widget-' + widget.id).load('/operations/dashboard/' + _widget);
            }
        });
    }

    /**
     * Timer
     * 12/31/24 CG: At some point, this timer will get refactored into a 
     * websocket as the setInterval() poller seems to be a hack
     */
    function timer() {
        //console.log('timer()');
        // (1) Get some variables ready
        var autoRefresh = 5 * 60; // in seconds
        //var autoRefresh = 2; // in seconds
        var dotUnit = 60; // in seconds
        var interval = 0; // interval (calculated later)
        var timer;
        var counter = 0;
        var html = '';
        // (2) Compute the interval 
        interval = autoRefresh / dotUnit;
        //alert("auto-refresh: " + autoRefresh + " sec, dot: " + dotUnit + " sec");
        //alert("# of dots: " + interval);
        // (3) Figure out the dots on screen
        for (var i = 0; i < interval; i++) {
            html += '&#149';
        }
        $('#div-dots').html(html);
        // (4) Set the timer
        timer = setInterval(() => {
            //console.log('Counter: ' + counter + " | Interval: " + interval);
            if (counter >= interval) {
                //console.log('... refreshing');
                //loadAll();
                //dashboard.loadAll();
                refresh();
                // set counter to zero
                counter = 0;
            } else {
                //console.log('... not refreshing');
                //console.log(counter);
                counter++;
                html = '';
                for (var i = 0; i < (interval - counter); i++) {
                    html += '&bull;';
                }
                $('#div-dots').html(html);
            }
        }, dotUnit * 1000);
    }

    /**
     * Define the default widgets if we find nothing else or we want to reset
     * 
     * 1/3/24 CG: If we want to create new widgets, create it in here and it will sync
     * up to the user's local saved layout and cleanup
     * 
     * 1/4/25 CG: @todo implement the icon
     * 
     * {
     *   id: 'key',         // usually this is action_{{ id }} in the controller 
     *   title: '',         // title to display, if empty, just use the id 
     *   x: 0,              // col sequence, currently only for left (0) and right columns (9)
     *                      // based on a 12-column grid
     *   y: 0,              // row sequence, lower number means higher up on dashboard
     *   width: 8,          // width based on a 12-column grid 
     *   type: 'list',      // we use this to decide what the widget looks like 
     *                      // 'list' allow resize of height or height = "" for FULL height (not pretty)
     *                      // 'tile' means no resize capability and display entire 
     *                      // ... 
     *   height: 100,       // height in pixels
     *                      // "" means full height usually for tiles bust lists will show full height
     *   visible: boolean,  // display/hide widget
     *   color: '#000',     // hex of the color indicator on the left side of title
     *   icon: 'fa-...',    // fontawesome icon, example: 'fa-regular fa-bell'
     * }
     * 
     */
    function _default() {
        // (1) Define the widgets
        var widgets = [
            // (1.1) Left side column
            { id: 'reservations',    title: 'Reservations',             x: 0,  y: 1,  width: 8, type: 'list', icon: 'fa-thin fa-table-list', },
            { id: 'queues',          title: 'Queues',                   x: 0,  y: 2,  width: 8, type: 'list', icon: 'fa-thin fa-list-tree', },
            { id: 'escalations',     title: 'Escalations',              x: 0,  y: 3,  width: 8, type: 'list', icon: 'fa-thin fa-escalator', },
            { id: 'messages',        title: 'Centrals',                 x: 0,  y: 4,  width: 8, type: 'list', icon: 'fa-thin fa-envelope', },
            { id: 'appraisers',      title: 'Appraisers',               x: 0,  y: 5,  width: 8, type: 'list', icon: null, },
            { id: 'clients',         title: 'Clients',                  x: 0,  y: 6,  width: 8, type: 'list', icon: null, },
            // (1.2) Left side column summary
            { id: 'search',          title: 'Search',                   x: 0,  y: 7,  width: 4, type: 'tile', icon: 'fa-thin fa-magnifying-glass', },
            { id: 'orders-by-day',   title: 'Last 3 Weeks',             x: 0,  y: 8,  width: 4, type: 'tile', icon: 'fa-thin fa-list', },
            { id: 'statuses',        title: 'Counts by Status',         x: 0,  y: 9,  width: 8, type: 'tile', icon: 'fa-thin fa-wave-pulse', },
            { id: 'orders-last',     title: 'Orders - Last Viewed',     x: 0,  y: 10, width: 8, type: 'list', icon: null, },
            // (1.3) Right side column
            { id: 'reminders',       title: 'Reminders',                x: 9,  y: 1,  width: 4, type: 'list', icon: 'fa-thin fa-bell', },
            { id: 'central',         title: 'Central',                  x: 9,  y: 2,  width: 4, type: 'tile', icon: 'fa-thin fa-inbox', },
            { id: 'valuations',      title: 'Valuations',               x: 9,  y: 3,  width: 4, type: 'tile', icon: 'fa-thin fa-chart-line', },
            { id: 'orders',          title: 'Orders',                   x: 9,  y: 4,  width: 4, type: 'tile', icon: null, },
            { id: 'status',          title: 'Status',                   x: 9,  y: 5,  width: 4, type: 'tile', icon: 'fa-thin fa-headset', },
            { id: 'qc',              title: 'QC',                       x: 9,  y: 6,  width: 4, type: 'tile', icon: 'fa-thin fa-stamp', },
            { id: 'sales',           title: 'Sales',                    x: 9,  y: 7,  width: 4, type: 'tile', icon: 'fa-thin fa-phone-volume', },
            { id: 'compliance',      title: 'Compliance',               x: 9,  y: 8,  width: 4, type: 'tile', icon: 'fa-thin fa-gavel', },
            { id: 'accounting',      title: 'Accounting',               x: 9,  y: 9,  width: 4, type: 'tile', icon: 'fa-thin fa-circle-dollar', },
            { id: 'tech',            title: 'Tech',                     x: 9,  y: 10, width: 4, type: 'tile', icon: 'fa-thin fa-microchip', },
            { id: 'users-last',      title: 'Users - Last Viewed',      x: 9,  y: 11, width: 4, type: 'list', icon: null, },
            { id: 'groups-last',     title: 'Groups - Last Viewed',     x: 9,  y: 12, width: 4, type: 'list', icon: null, },
            { id: 'clients-last',    title: 'Clients - Last Viewed',    x: 9,  y: 13, width: 4, type: 'list', icon: null, },
            { id: 'appraisers-last', title: 'Appraisers - Last Viewed', x: 9,  y: 14, width: 4, type: 'list', icon: null, },
        ];
        //console.log(widgets);
        // (2) Loop through each widget
        widgets.forEach((obj, index) => {
            // (2.1) Set the "default" height of a widget if list
            var height = null;
            if (widgets[index].type == 'list') {
                height = HEIGHT_SM;
            }
            // (2.2) Add the rest of the properties into the widget 
            widgets[index] = { ...obj, height, visible: true, color: '#007ac1', };
        });
        //console.log(widgets);
        // (3) Push them a layout object 
        var layout = {
            metadata: null,
            widgets, 
            theme: 'light',
            gridSize: { columns: 12, rows: null, },
        }
        // return 
        return layout;
    }

    // ==================== TLES ====================

    /**
     * Colorize
     */
    function colorize(selector, count, important) {
        var color = '#eee';
        if (parseInt(count) > 0) {
            if (important) {
                color = '#FFB7B7'; // RED
            } else {
                color = '#FCFA71'; // YELLOW
            }
        } else if (isNaN(count)) {
            color = '#FFB7B7'; // RED
        } else if (parseInt(count) == 0) {
            color = '#15DB00'; // GREEN
        }
        $(selector).css('background-color', color);
    }

    /**
     * Render the tile using data from the backend
     *
     * {
     *    id:           ''  // ID (unique)
     *    title:        '', // Title
     *    description:  '', // More info about this tile
     *    text:         '', // Text to display (allow html)
     *    link:         '', // link (make the text clickable)
     *    status:       '', // success, warning, danger
     * }
     */
    function tile(tile) {
        //console.log(tile);
        // (1) Make sure we have some basic stuff
        if (! tile || ! tile.id || ! tile.title) {
            return;
        }
        // TODO: Make this into a handlebars template later
        // (2) Start the HTML
        var html = '<div class="tile-card">';
        html += '<div class="tile-title">' + tile.title + '</div>';
        // (3) Body of the title
        html += '<div class="tile-data">';
        // (4) Show link
        if (tile.link) {
            html += '<a href="' + tile.link + '" target="_blank">' + tile.text + '</a>';
        } else {
            html += tile.text;
        }
        // (5) Closing tags
        html += '</div>';
        html += '</div>';
        // (6) Set the HTML
        //$('#tile-'+tile.id).html(html);
        $("[data-id='" + tile.id + "']").html(html);
        // (7) Set the color
        if (tile.status) {
            if (tile.status == 'success') {
                $("[data-id='" + tile.id + "']").css('background-color', '#15db00');
            } else if (tile.status == 'warning') {
                $("[data-id='" + tile.id + "']").css('background-color', '#fcfa71');
            } else if (tile.status == 'danger') {
                $("[data-id='" + tile.id + "']").css('background-color', '#ffb7b7');
            }
        }
        // (8) Pop in the "title" for the DIV for the description
        if (tile.description) {
            $("[data-id='" + tile.id + "']").attr('title', tile.description);
        }
    }

    /**
     * Convenience function to load a bunch of tiles
     */
    function tiles(tiles) {
        if (! tiles) {
            return;
        }
        for (var _tile in tiles) {
            tile(tiles[_tile]);
        }
    }

    // ==================== LAYOUT ====================

    /**
     * Update one piece of the layout
     * 
     * widgets is a hashmap that looks like
     * 
     * {
     *   'widgetId-1': value,
     *   'widgetId-2': value,
     * }
     */
    function update(component, widgets) {
        //console.log('update()');
        //console.log(component);
        //console.log(widgets);
        // (1) Load the layout
        var layout = load();
        // (2) Loop through each widget
        var updated = [];
        layout.widgets.forEach(_widget => {
            //console.log(widget);
            if (_widget[component] !== undefined && widgets[_widget.id] !== undefined) {
                console.log(`updating ${_widget.id} ${component} to ${widgets[_widget.id]}`);
                _widget[component] = widgets[_widget.id];
            }
            // Push back into updated array so we get everybody back in
            updated.push(_widget);
        });
        //console.log(updated);
        // (3) Resort the widgets into some type of order so that it is easier on the rendering engine
        // 1/3/25 CG: We want to have the lowest X first, then lowest Y
        //var sorted = updated;
        var sorted = updated.slice().sort((a, b) => {
            if (a.x !== b.x) {
                return a.x - b.x; // Sort by x coordinate
            }
            return a.y - b.y; // If x is the same, sort by y coordinate
        });
        //console.log(sorted);
        // (4) Save the widgets back into the layout
        layout.widgets = sorted;
        // (5) Save the layout
        save(layout);
        // return
        return layout;
    }

    /**
     * Load layout
     */
    function load() {
        //console.log('load()');
        // (1) Load from local 
        var layout = localStorage.getItem(CACHE_KEY);
        // (2) If empty, load the default
        if (layout != null && layout != '') {
            //console.log('got something from localStorage');
            layout = JSON.parse(layout);
            return layout;
        }
        // (3) just return the default
        return _default();
    }

    /**
     * Save layout
     */
    function save(layout) {
        //console.log('save()');
        // (1) Do not save if the layout is blank
        if (layout == null || layout == '') {
            return;
        }
        // (2) Save to local
        var _date = new Date();
        layout.metadata = {
            timestamp: _date.toISOString(),
            local: _date,
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(layout));
        // (3) 1/3/24 CG: @todo Save to backend so we can figure out if anybody is doing anything
        phery.remote('save_layout', {layout}, {target: '/operations/dashboard'});
        // return
        return layout;
    }

    /**
     * Reset layout
     */
    function reset() {
        //console.log('reset()');
        localStorage.removeItem(CACHE_KEY);
        $.snack('success', 'Dashboard has been reset to default settings', 50000);
    }

    /**
     * Customize
     * 
     * This is a toggle to enable the customization controls
     */
    function customize() {
        //console.log('customize()');
        // (1) Check if we are enabling customization of hiding it 
        // 1/3/24 CG: If the controls are hidden, assume we are going to go into "customization" mode
        var hidden = $('.widget-control').hasClass('d-none');
        // (2) If currently hidden, enable the customization controls
        if (hidden) {
            // (3) Sync up the saved layout with gets returned by _default()
            // 1/3/24 CG: @todo massive todo here to get the loading of new widgets working
            var master = _default();
            // (4) Loop through and make sure the saved local is in sync with the default
            var layout = load();
            if (layout == null) {
                layout = master;
            } else {
                layout.widgets = sync(layout.widgets, master.widgets);
            }
            // (5) Once we are done with the cleanup, save
            layout = save(layout);
            // (6) 1/3/24 CG: @todo How do we show the hidden widgets so that the user can toggle 
            render(true);
            //refresh();
            // (7) Display the controls and enable the sorters
            $('.widget-control').removeClass('d-none');
            $('#div-sortable-right').sortable('enable');
            $('#div-sortable-left').sortable('enable');
            // (8) Attach listeners to the switch for visible/not visible 
            $('.widget-toggle-visible').on('click', function() {
                var id = $(this).data('id');
                update('visible', {[id]: $(this).is(':checked')});
            });
            // (9) Attach colorpicker
            $('.colorpicker-control').colorpicker({
            }).on('change', (event) => {
                //console.log(event);
                //console.log($(event.target).attr('id'));
                var id = $(event.target).attr('id')
                //console.log(id + ' | ' + event.color.toHexString());
                update('color', {[id]: event.color.toHexString()});
                //$(this).colorpicker('hide');
                //event.colorpicker.hide();
            });
            // (10) Attach listener to the height toggle
            // $('.widget-toggle-height').on('click', function() {
            //     var id = $(this).data('id');
            //     var height = $(this).is(':checked') ? HEIGHT_SM : '';
            //     update('height', {[id]: height});
            // });
            // 1/5/24 CG: Allow more than one height
            $('.widget-toggle-height').on('click', function() {
                var id = $(this).data('id');
                var height = $(this).val();
                update('height', {[id]: height});
            });
            // (11) Show the reset button 
            $('#button-reset').show();
            // return
            return;
        }
        // (12) If customization controls are visible, we need to disable them 
        $('.widget-control').addClass('d-none');
        $('#div-sortable-right').sortable('disable');
        $('#div-sortable-left').sortable('disable');
        $('.widget-toggle-visible').off('click');
        $('.widget-toggle-height').off('click');
        // (13) Hide the reset button 
        $('#button-reset').hide();
        render(false);
    }

    /**
     * Helper function to sync the layout to the "master" as published in the _default()
     */
    function sync(current, master) {
        //console.log('sync()');
        // (1) Get the list of IDs from the "master" list (which is the _default() that we can change)
        var masterIds = new Set(master.map(item => item.id)); 
        var currentIds = new Set(current.map(item => item.id));
        // (2) Get the missing
        var missingIds = Array.from(masterIds).filter(id => !currentIds.has(id));
        var missingItems = master.filter(item => missingIds.includes(item.id));
        // (3) Get the final
        var after = [...current, ...missingItems];
        // (4) 1/4/25 CG: Add ability to override specific properties on the master
        var final = [];
        after.forEach(_widget => {
            var _master = master.find(obj => obj.id === _widget.id);
            if (_master) {
                // (4.1) Override icon
                _widget.icon = _master.icon ?? null;
            }
            final.push(_widget);
        });
        // return
        return final;
    }

    /**
     * Display greeting
     */
    function greeting(name, element) {
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
            <div style="font-family: 'Epilogue', sans-serif; text-transform: none; text-transform: none; font-size: 1.8rem; margin-bottom: 8px;">
                ${greeting}
            </div>
        `;
        $(element).html(html);
    }

    // define the public module
    var d = {};
    d.initialize = initialize;
    d.render = render;
    d.refresh = refresh;
    d.timer = timer;
    d.tile = tile;
    d.tiles = tiles;
    d.colorize = colorize;
    d._default = _default;
    d.load = load;
    d.save = save;
    d.reset = reset;
    d.update = update;
    d.customize = customize;
    d.sync = sync;
    d.greeting = greeting;
    return d;

}());