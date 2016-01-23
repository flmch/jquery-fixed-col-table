(function($){
  $.fn.freezeTbl = function(param){
    param.$tableWrap = param.$tableWrap || $(this);
    param.$innerWrap = param.$tableWrap.find('.innerWrap');
    return this.each(function(){
      // ReshapeTable.call($(this),param);
      new ReshapeTable(param);
    });
  }

  function ReshapeTable(param){
    this.prop = $.extend({
      colNum: 0,
      headNum: 1,
      headerH: 0,
      headerInfo: [
        {
            title: 'Weekday',
            width: 80
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
      ]
    },param);
    this.initLayout();
    this.freezeHeader();
    this.freezeCol();
  }

  ReshapeTable.prototype = {
    getHeaderInfo: function(){
      var $tableWrap = this.prop.$tableWrap;
      this.prop.headerInfo = Array.prototype.slice.call(
        $tableWrap.find('> div div:first span').map(function(index,spn){
          return {
            title: $(spn).text(),
            width : $(spn).width(),
            height: $(spn).height()
          }
        })
      );
      return false;
    },
    getTableWidth: function(colNum){
      return this.prop.headerInfo.reduce(function(preVal,curEle,index){
        return preVal +  ( (!colNum || index+1 <= colNum) ? curEle.width : 0 );
      },0)
    },
    initLayout: function(){
      var self = this;
      var $tableWrap = self.prop.$tableWrap;
      var $innerWrap = self.prop.$innerWrap;
      var $rows = $innerWrap.find('> div');
      $rows.addClass('tableRow').css({'width':self.getTableWidth()});
      self.prop.headerInfo.forEach(function(info,index){
        $rows.find('span:nth-child(' + (index + 1) + ')')
            .addClass(info.title)
            .css({
              width: info.width,
              display: 'inline-block',
              float: 'left'
            });
      });
      $innerWrap.css({
        'position':'absolute',
        'width': '100%',
        'height': '100%',
        'overflow': 'auto'
      });
    },
    freezeHeader: function(){
      var headerH = 0;
      var $tableWrap = this.prop.$tableWrap;
      var $innerWrap = this.prop.$innerWrap;
      var $rows = $innerWrap.find('.tableRow');
      var $freezedHead = $('<div>')
            .addClass('freezedHead')
            .insertBefore($innerWrap)
            .css({position: 'absolute'});
      for(var i=0;i<this.prop.headNum;i++){
        $rows.eq(i).detach().appendTo($freezedHead);
        headerH += $rows.eq(i).find('span:first').height();
      }
      $innerWrap.css({
        top: headerH,
        height: $tableWrap.height() - headerH,
        'z-index': 20,
        'background-color': 'white'
      }).on('scroll', function(event){
        $freezedHead.css({
          left: -$innerWrap.scrollLeft()
        });
      });
      $(window).on('resize', function(){
          $innerWrap.css({height: $tableWrap.height() - headerH});
      });
      this.prop.headerH = headerH;
    },
    freezeCol: function(){
      var self = this;
      var freezedWidth = this.getTableWidth(this.prop.colNum);
      var $tableWrap = this.prop.$tableWrap;
      var $innerWrap = this.prop.$innerWrap;

      // top left section
      var $freezedHead = $tableWrap.find('.freezedHead');
      var $headCells = $freezedHead.find('> div > span');
      var $freezedHeadLeft = $('<div>')
            .addClass('freezedHeadLeft')
            .insertBefore($freezedHead)
            .css({position: 'absolute','background-color': 'white','z-index':20});
      var $newRowHead = $('<div>')
            .addClass('tableRow')
            .appendTo($freezedHeadLeft)
      for(var i=0;i<this.prop.colNum;i++){
        $headCells.eq(i).detach().appendTo($newRowHead);
      }
      $freezedHead.css({
        left: freezedWidth,
        width: $tableWrap.width() - freezedWidth
      });
      $innerWrap.on('scroll', function(){
        $freezedHead.css({
          left: self.getTableWidth(self.prop.colNum) - $innerWrap.scrollLeft()
        });
      }).css({
        left: freezedWidth,
        width: $tableWrap.width() - freezedWidth
      });

      // bottom left section
      var $freezedBtmLeft = $('<div>')
            .addClass('freezedBtmLeft')
            .css({
              position: 'absolute',
              top: self.prop.headerH,
              height: $tableWrap.height() - self.prop.headerH,
              'overflow': 'scroll',
            })
            .insertBefore($innerWrap)
      $innerWrap.find('.tableRow').each(function(index,row){
        var $newRow = $('<div>')
              .addClass('tableRow')
              .css({width: freezedWidth})
              .appendTo($freezedBtmLeft);
        var $spans = $(this).find('span');
        for(var j=0;j<self.prop.colNum;j++){
          $spans.eq(j).detach().appendTo($newRow);
        }
        $(this).css({width: $(this).width() - freezedWidth });
      });
      $innerWrap.on('scroll', function(event){
        $freezedBtmLeft.scrollTop($innerWrap.scrollTop());
      });
      $freezedBtmLeft.on('scroll', function(event){
        $innerWrap.scrollTop($freezedBtmLeft.scrollTop());
      });

      // scroll area move as window resize
      $(window).on('resize', function(){
          $innerWrap.css({width: $tableWrap.width() - freezedWidth});
          $freezedBtmLeft.css({
            height: $tableWrap.height() - self.prop.headerH
          });
          $freezedHead.css({
            width: $tableWrap.width() - freezedWidth
          });
      });
    }
  }
})(jQuery);
