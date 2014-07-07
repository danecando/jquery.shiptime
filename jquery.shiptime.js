/*!
 * @package jquery.shiptime
 * @version 0.1.3
 * @copyright (C) 2014 Dane Grant (danecando@gmail.com)
 * @license MIT
 */
;(function($) {

    var defaults = {

        // UTC timezone offset for your stores location
        timezone: '-0400',

        // Enter your shipping cutoff deadline in 24 hour format
        deadline: {
            hour: 16,
            minute: 0
        },

        // Name of estimated shipping method
        shipMethodName: 'Fixed Rate Shipping',

        // This is to make sure we only show transit info if an item is in stock!
        stockSelector: '.availability span',  // selector for element that notifies stock status
        inStockText: 'In stock',        // in stock text
        // inStockText : true,              // use this if you want to show for all items

        // Add dates that we will be excluding from shipping and delivery (comma separated)
        noShipping: '12/24,12/25',

        // If you want to estimate delivery dates enter estimated lead time for each state in days
        leadtime: {
            'Alabama': 2,
            'Alaska': 6,
            'Arizona': 5,
            'Arkansas': 2,
            'California': 5,
            'Colorado': 4,
            'Connnecticut': 3,
            'Delaware': 3,
            'Florida': 1,
            'Georgia': 2,
            'Hawaii': 7,
            'Idaho': 5,
            'Illinois': 3,
            'Indiana': 2,
            'Iowa': 3,
            'Kansas': 3,
            'Kentucky': 2,
            'Louisiana': 2,
            'Maine': 3,
            'Maryland': 3,
            'Massachusetts': 3,
            'Michigan': 3,
            'Minnesota': 3,
            'Mississippi': 2,
            'Missouri': 3,
            'Montana': 5,
            'Nebraska': 4,
            'Nevada': 5,
            'New Hampshire': 3,
            'New Jersey': 3,
            'New Mexico': 4,
            'New York': 4,
            'North Carolina': 2,
            'North Dakota': 5,
            'Ohio': 2,
            'Oklahoma': 3,
            'Oregon': 5,
            'Pennsylvania': 3,
            'Rhode Island': 3,
            'South Carolina': 2,
            'South Dakota': 4,
            'Tennessee': 2,
            'Texas': 3,
            'Utah': 5,
            'Vermont': 3,
            'Virginia': 2,
            'Washington': 5,
            'West Virginia': 2,
            'Wisconsin': 3,
            'Wyoming': 5
        }
    };

    function ShippingTime(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);

        try {
            if (moment === undefined || $ === undefined ) throw Error("please include jquery & moment.js");
        } catch (e) {
            console.log(e);
        }

        // Display shipping deadline info
        this.displayShipTime();
    }


    ShippingTime.prototype.isWeekday = function(moment) {
        return (moment.day() !== 0 && moment.day() !== 6) ? true : false;
    };


    ShippingTime.prototype.isExcluded = function(moment) {
        var dates = this.options.noShipping.split(',');
        for(var i = 0; i < dates.length; i++) {
            if (moment.zone("-0500").format("M/D") == dates[i]) {
                return true;
            }
        }
        return false;
    };


    ShippingTime.prototype.shipDay = function(deadline) {
        return (moment().zone(this.options.timezone).isSame(deadline, "d")) ? "Today" : deadline.format("dddd");
    };


    ShippingTime.prototype.shippingDeadline = function(hour, minute) {
        var deadline = moment().zone(this.options.timezone).hour(hour).minute(minute).second(0);
        while (this.isExcluded(deadline)) {
            deadline.add('h', 24);
        }
        if (moment().zone(this.options.timezone).hour() >= deadline.hour() && this.isWeekday(moment().zone(this.options.timezone))) {
            deadline.add('h', 24);
        }
        if (!this.isWeekday(deadline)) {
            return (deadline.day() === 0) ? deadline.add('h', 24) : deadline.add('h', 48);
        } else {
            return deadline;
        }
    };


    ShippingTime.prototype.timeUntilDeadline = function(deadline) {
        var minutesTill = Math.abs(moment().zone(this.options.timezone).diff(deadline, 'm'));
        for (var hoursTill = 0; minutesTill >= 60; hoursTill++) {
            minutesTill -= 60;
        }
        return { 'hours': hoursTill, 'minutes': minutesTill };
    };


    ShippingTime.prototype.projectedDeliveryDate = function(deliveryTime, state) {
        var estimateDay = this.deliveryTime.add('d', this.options.leadtime[state]).format("dddd, MMM Do");
        while (this.isExcluded(estimateDay)) {
            estimateDay.add('h', 24);
        }
        if (!this.isWeekday(estimateDay)) {
            return (estimateDay.day() === 0) ? estimateDay.add('h', 24) : estimateDay.add('h', 48);
        } else {
            return estimateDay;
        }
    };

    ShippingTime.prototype.displayShipTime = function() {

        var plugin = this;

        if ($(this.options.stockSelector).text() == this.options.inStockText || this.options.inStockText === true) {

            var deadline = this.shippingDeadline(this.options.deadline.hour, this.options.deadline.minute);
            var timeLeft = this.timeUntilDeadline(deadline);

           $(this.element).append('<span class="order">Order</span> within <span class="time-left">' + timeLeft.hours + ' hrs ' + timeLeft.minutes + ' mins</span> to ship <span class="ship-day">' + this.shipDay(deadline) + '</span>');

            if (this.options.leadtime) {
                $.get("http://getgeoip.net/json/", function (data) {
                    ;
                }, "jsonp")
                .then( function(data) {
                    if (data.country_code == "US" && data.region_name !== null) {
                        $(plugin.element).append('<span class="est-delivery">Est Delivery:</span> ' + plugin.projectedDeliveryDate(deadline, data.region_name) + '<br><span class="deliver-time"> to ' + data.region_name + ' via ' + plugin.options.shipMethodName + '</span>');
                    }
                });
            }
        }
    };


    $.fn.shipTime = function(options) {
        return this.each(function() {
            new ShippingTime(this, options);
        });
    };

})(jQuery);