'use strict';

describe('freezeTbl',function(){
  beforeAll(function(){
    var $container = $('<div>')
          .addClass('tableWrap')
          .css({
            'position':'absolute',
            'left': '100px',
            'top': '50px',
            'width': '60%',
            'height': '80%'
          })
          .appendTo('body');
    this.$myTable = $container.freezeTbl({
      colNum: 3,
      headerInfo: testHeaderInfo
    });
  });

  it('should define $myTable', function(){
    expect(this.$myTable).toBeDefined();
  });

  describe('should run each testdata', function(){
      tableData.forEach(function(data, index){
        it('should have amount of row equals to number of  data records', function(){
          this.$myTable.displayContent(data);
          var $table = this.$myTable;
          var $tableRows = $table.prop.$container.find('.btmWrap .tableRow:visible');
          var numOfRecords = data.length;
          expect($tableRows.length).toBe(numOfRecords);
        });

        it('should has 1 fixed row of header and n fixed column', function(){
          var $table = this.$myTable;
          var $topLeftWrap = $table.prop.$topLeftWrap;
          var $btmLeftWrap = $table.prop.$btmLeftWrap;
          expect(this.$myTable.prop.colNum).toBe(3);
        });
      });
  });

});
