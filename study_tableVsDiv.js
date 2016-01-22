'use strict';

// study that compares speed to generate table in <table> and <div>
// conclusion: similar speed,

// startBuildTable: 265.403ms
// startBuildDiv: 216.281ms

$(function(){
  console.time('startBuildTable');

  var $newTable = $('<table>');

  for(var i=0;i<100;i++){
    var $newRow = $('<tr>');
    for(var j=0;j<30;j++){
      $('<td>').text('d').appendTo($newRow);
    }
    $newRow.appendTo($newTable);
  }

  $newTable.appendTo($('.tableWrap'));
  console.timeEnd('startBuildTable');

/////////////////////////////////////
  console.time('startBuildDiv');

  var $newDiv = $('<div>');

  for(var i=0;i<100;i++){
    var $newRow = $('<div>');
    for(var j=0;j<30;j++){
      $('<span>').text('d').appendTo($newRow);
    }
    $newRow.appendTo($newDiv);
  }

  $newDiv.appendTo($('.divWrap'));
  console.timeEnd('startBuildDiv');
})
