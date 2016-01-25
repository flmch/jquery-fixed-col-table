'use strict';

$(function(){
  $('.tableWrap').css({
    'position':'absolute',
    'left': '200px',
    'width': '20%',
    'height': '20%'
    // 'background-color': 'red',
  });
  // $('.tableWrap').freezeTbl({headNum: 1,colNum: 1});
  $('.tableWrap').freezeTbl({
    headNum: 1,
    colNum: 1,
    headerInfo: [
      {
          title: 'Weekday',
          width: 100
      },
      {
          title: 'Date',
          width: 80
      },
      {
          title: 'Manager',
          width: 80
      },
      {
          title: 'Qty',
          width: 80
      },
    ],
    content: [
      {
        'Weekday':  'Mon',
        'Date': '09/11',
        'Manager': 'Kelsey',
        'Qty': 639
      },
      {
        'Weekday':  'Tue',
        'Date': '09/12',
        'Manager': 'Lindsey',
        'Qty': 534
      },
      {
        'Weekday':  'Wed',
        'Date': '09/13',
        'Manager': 'Susan',
        'Qty': 1002
      },
      {
        'Weekday':  'Thu',
        'Date': '09/14',
        'Manager': 'Kelsey',
        'Qty': 639
      },
      {
        'Weekday':  'Fri',
        'Date': '09/15',
        'Manager': 'Kelsey',
        'Qty': 639
      },
      {
        'Weekday':  'Sat',
        'Date': '09/16',
        'Manager': 'Kelsey',
        'Qty': 639
      },
      {
        'Weekday':  'Sun',
        'Date': '09/17',
        'Manager': 'Kelsey',
        'Qty': 639
      }
    ]
  });
})
