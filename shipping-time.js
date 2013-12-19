var config = {

    // UTC timezone offset for your stores location
    timezone: '-0500',

    // Enter your shipping cutoff deadline in 24 hour format
    deadline: {
        hour: 16,
        minute: 0
    },

    // Name of estimated shipping method
    shipMethodName: 'Fixed Rate Shipping',

    // This is to make sure we only show transit info if an item is in stock!
    stockSelector  : 'p.availability',  // selector for element that notifies stock status
    // inStockText    : 'in-stock',        // in stock text  
    inStockText : true,              // use this if you want to show for all items

    // Add dates that will be exluding from shipping and delivery (comma separated)
    noShipping: '12/24, 12/25',

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

function isWeekday(moment) {
    return (moment.day() !== 0 && moment.day() !== 6) ? true : false;
}

function isExcluded(moment) {
    var dates = config.noShipping.split(', ');
    for (var i = 0; i < dates.length; i++) {
        if (moment.zone(config.timezone).format("M/D") == dates[i]) {
            return true;
        }
    }
    return false;
}

function shipDay(deadline) {
    return (moment().zone(config.timezone).isSame(deadline, "d")) ? "Today" : deadline.format("dddd");
}

function shippingDeadline(hour, minute) {
    var deadline = moment().zone(config.timezone).hour(hour).minute(minute).second(0);
    while (isExcluded(deadline)) {
        deadline.add('h', 24);
    }
    if (moment().zone(config.timezone).hour() >= deadline.hour() && isWeekday(moment().zone(config.timezone))) {
        deadline.add('h', 24);
    }
    if (!isWeekday(deadline)) {
        return (deadline.day() === 0) ? deadline.add('h', 24) : deadline.add('h', 48);
    } else {
        return deadline;
    }
}

function timeUntilDeadline(deadline) {
    var minutesTill = Math.abs(moment().zone(config.timezone).diff(deadline, 'm'));
    for(var hoursTill = 0; minutesTill >= 60; hoursTill++) {
        minutesTill -= 60;
    }
    return { 'hours': hoursTill, 'minutes': minutesTill };
}

function projectedDeliveryDate(deliveryTime, state) {
    var estimateDay = deliveryTime.add('d', config.leadtime[state]);
    while (isExcluded(estimateDay)) {
        estimateDay.add('h', 24);
    }
    if (!isWeekday(estimateDay)) {
        return (estimateDay.day() === 0) ? estimateDay.add('h', 24).format("dddd, MMM Do") : estimateDay.add('h', 48).format("dddd, MMM Do");
    } else {
        return estimateDay.format("dddd, MMM Do");
    }
}

jQuery(document).ready(function($) {
    if ($(config.stockSelector).text() == config.inStockText || config.inStockText === true) {
        var deadline = shippingDeadline(config.deadline.hour, config.deadline.minute);
        var timeLeft = timeUntilDeadline(deadline);

        $("#ship-time").html('<span class="bold">Order</span> within <span class="green">' + timeLeft.hours + ' hrs ' + timeLeft.minutes + ' mins</span> to ship <span class="bold">' + shipDay(deadline) + '</span>');

        if (config.leadtime) {
            $.get("http://freegeoip.net/json/", function(data){;}, "jsonp")
            .then(function(data) {
                if (data.country_code == "US" && data.region_name !== null) {
                    $("#delivery-date").html('<span class="bold">Est Delivery:</span> ' + projectedDeliveryDate(deadline, data.region_name) + '<br><span class="small-print"> to ' + data.region_name + ' via ' + config.shipMethodName  + '</span>');
                }
            });
        }
    }
});
