'use strict';

$(function(){
  $('.tableWrap').css({
    'position':'absolute',
    'left': '200px',
    'width': '20%',
    'height': '40%',
    'overflow': 'hidden',
    'background-color': 'red'
  });
  // $('.innerWrap').css({
  //   // 'position':'absolute',
  //   'width': '100%',
  //   'height': '100%',
  //   // 'top'   : '19px',
  //   'overflow': 'auto'
  // });
  // $('.tableRow').width(320);
  // $('span').css({
  //   'display': 'inline-block',
  //   'float': 'left'
  // });
  // $('.A').width(80);
  // $('.B').width(80);
  // $('.C').width(80);
  // $('.D').width(80);
  // $('span').css({
  //   'display': 'inline-block'
  // }).width(50);
  $('.tableWrap').freezeTbl({colFreeze: 0});
})
