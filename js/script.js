'use strict';

$(function(){
  $('.tableWrap').css({
    'position':'absolute',
    'left': '200px',
    'width': '15%',
    'height': '20%',
    'overflow': 'hidden',
    'background-color': 'red',
  });
  $('.tableWrap').freezeTbl({colNum: 1});
})
