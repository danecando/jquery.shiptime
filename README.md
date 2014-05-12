shipping-time
=============

Shipping Time is a jQuery plugin that displays the time until the shipping cut off for your eCommerce website. You can also configure it to show estimated delivery dates based on user location.

The output looks like this: 
Order within 2 hrs 4 mins to ship Today
Est. Delivery: Thursday, Dec 12th
To Florida via Fixed Rate Shipping

## Requirements 
Shipping Time makes use of jQuery & Moment.js. Both files are included in the vendor directory. 

Include files on your webpage before the closing body tag
```html
<script src="vendor/jquery-1.9.1.min.js"></script>
<script src="vendor/moment.min.js"></script>
<script src="shipping-time.js"></script>
```

## Installation 
Include the following html where you want to display the plugin on your webpage.
```html
<div id="shipping-time">
    <p id="ship-time"></p>
    <p id="delivery-date"></p>
</div>
```

It also includes a shipping-time.css file for basic styling of the output. You can change this to fit your website
```html
<link rel="stylesheet" type="text/css" href="shipping-time.css">
```

## Configuration 
Configuration is included at the top of the shipping-time.js file. It is commented to make it easier to setup. 

Set the UTC offset for your location and the time of your shipping cut off in 24 hour format
```javascript
var  config = {

// UTC timezone offset for your stores location
timezone: '-0500',

// Enter your shipping cutoff deadline in 24 hour format
deadline: {
    hour: 16,
    minute: 0
},
```


Set the name of your featured shipping method 
```javascript
// Name of estimated shipping method
shipMethodName: 'Fixed Rate Shipping',
`````

This part targets the element containing your items stock status. Put the selector for jQuery and for inStockText put the text that shows when an item is in stock. ie: In Stock In-stock ect... This will make sure that the plugin only displays for items that are in stock. If you want to just show it for all of your items change the value to true.
```javascript
// This is to make sure we only show transit info if an item is in stock!
stockSelector  : 'p.availability',  // selector for element that notifies stock status
inStockText    : 'in-stock',        // in stock text  
//inStockText : true,              // use this if you want to show for all items
```

If you're going to display estimated delivery dates put in the lead times for each state based on your shipping method. (UPS & Fedex generate maps with estimated times based on your location) The plugin detects the users location based on their ip address and delivers an estimated date based on your settings.
```javascript
// If you want to estimate delivery dates enter estimated lead time for each state in days
leadtime: {
    'Alabama': 2,
    'Alaska': 6,
    'Arizona': 5,
```

## Credits
jQuery - http://jquery.com
Moment.js - http://momentjs.com