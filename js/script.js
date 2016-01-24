'use strict';

$(function(){
  $('.tableWrap').css({
    'position':'absolute',
    'left': '200px',
    'width': '20%',
    'height': '20%'
    // 'background-color': 'red',
  });
  $('.tableWrap').freezeTbl({headNum: 1,colNum: 1});
})
