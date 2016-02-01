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
    this.prop = this.$myTable.prop
    this.$container = this.$myTable.prop.$container;
    this.$btmWrap = this.$myTable.prop.$btmWrap;
    this.$topWrap = this.$myTable.prop.$topWrap;
    this.$btmLeftWrap = this.$myTable.prop.$btmLeftWrap;
    this.$topLeftWrap = this.$myTable.prop.$topLeftWrap;
  });

  it('$myTable should be defined', function(){
    expect(this.$myTable).toBeDefined();
  });

  describe('should run each testdata', function(){
      tableData.forEach(function(data, index){
        it('should have amount of row equals to number of  data records', function(){
          this.$myTable.displayContent(data);
          var $table = this.$myTable;
          var $tableRows = this.$btmWrap.find('.tableRow:visible');
          var numOfRecords = data.length;
          expect($tableRows.length).toBe(numOfRecords);
        });

        it('should has 1 fixed row of header and n fixed column', function(){
          var $topLeftWrap = this.$topLeftWrap;
          var $btmLeftWrap = this.$btmLeftWrap;
          var fixedColNum = $btmLeftWrap == undefined ? 0 : $topLeftWrap.find('.tableRow:first span').length;

          expect($topLeftWrap.find('.tableRow').length).toBe(1);
          expect(fixedColNum).toBe(this.prop.colNum);
        });

        it('btmLeft and btm should have same number of row', function(){
          if( this.$btmLeftWrap !== undefined ){
            var leftRows = this.$btmLeftWrap.find('.tableRow:visible');
            var rightRows = this.$btmWrap.find('.tableRow:visible');
            expect(leftRows.length).toEqual(rightRows.length);
          }
        });
      });
  });

});
