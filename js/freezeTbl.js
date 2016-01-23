(function($){
  $.fn.freezeTbl = function(param){
    param.$tableWrap = param.$tableWrap || $(this);
    param.$btmWrap = param.$tableWrap.find('.btmWrap');
    return this.each(function(){
      // TableFreeze.call($(this),param);
      new TableFreeze(param);
    });
  }

  function TableFreeze(param){
    this.prop = $.extend({
      colNum: 0,
      headNum: 2,
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

  TableFreeze.prototype = {
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
      var $btmWrap = self.prop.$btmWrap;
      var $rows = $btmWrap.find('> div');
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
      $btmWrap.css({
        'position':'absolute',
        'width': '100%',
        'height': '100%',
        'overflow': 'auto'
      });

    },
    freezeHeader: function(){
      var headerH = 0;
      var $tableWrap = this.prop.$tableWrap;
      var $btmWrap = this.prop.$btmWrap;
      var $rows = $btmWrap.find('.tableRow');
      var $topWrap = $('<div>')
            .addClass('topWrap')
            .insertBefore($btmWrap)
            .css({position: 'absolute'});
      for(var i=0;i<this.prop.headNum;i++){
        $rows.eq(i).detach().appendTo($topWrap);
        headerH += $rows.eq(i).find('span:first').height();
      }
      $btmWrap.css({
        top: headerH,
        height: $tableWrap.height() - headerH,
        'z-index': 20,
        'background-color': 'white'
      }).on('scroll', function(event){
        $topWrap.css({
          left: -$btmWrap.scrollLeft()
        });
      });
      $(window).on('resize', function(){
          $btmWrap.css({height: $tableWrap.height() - headerH});
      });
      this.prop.headerH = headerH;
    },
    freezeCol: function(){
      var self = this;
      var freezedWidth = this.getTableWidth(this.prop.colNum);
      var $tableWrap = this.prop.$tableWrap;
      var $btmWrap = this.prop.$btmWrap;

      // top left section
      var $topWrap = $tableWrap.find('.topWrap');
      var $headRows = $topWrap.find('> div');
      var $topLeftWrap = $('<div>')
            .addClass('topLeftWrap')
            .insertBefore($topWrap)
            .css({
              position: 'absolute',
              'background-color': 'white',
              'z-index': 20,
              'height': this.prop.headerH
            });
            // console.log($tableWrap.width());
            // console.log(freezedWidth);
            // console.log($headRows);
      $headRows.each(function(index,row){
        var $newRow = $('<div>')
              .addClass('tableRow')
              .appendTo($topLeftWrap)
        var $rowSpns = $(row).find('span');
        $(row).css({width: self.getTableWidth() - freezedWidth});
        console.log($(row));
        console.log($tableWrap.width());
        console.log(freezedWidth);
        for(var i=0;i<self.prop.colNum;i++){
           $rowSpns.eq(i).detach().appendTo($newRow);
        }
      });
      $topWrap.css({
        left: freezedWidth,
        width: $tableWrap.width() - freezedWidth
      });
      $btmWrap.on('scroll', function(){
        $topWrap.css({
          left: self.getTableWidth(self.prop.colNum) - $btmWrap.scrollLeft()
        });
      }).css({
        left: freezedWidth,
        width: $tableWrap.width() - freezedWidth
      });

      // bottom left section
      var $btmLeftWrap = $('<div>')
            .addClass('btmLeftWrap')
            .css({
              position: 'absolute',
              top: self.prop.headerH,
              height: $tableWrap.height() - self.prop.headerH,
              'overflow': 'scroll',
            })
            .insertBefore($btmWrap)
      $btmWrap.find('.tableRow').each(function(index,row){
        var $newRow = $('<div>')
              .addClass('tableRow')
              .css({width: freezedWidth})
              .appendTo($btmLeftWrap);
        var $spans = $(this).find('span');
        for(var j=0;j<self.prop.colNum;j++){
          $spans.eq(j).detach().appendTo($newRow);
        }
        $(this).css({width: $(this).width() - freezedWidth });
      });
      $btmWrap.on('scroll', function(event){
        $btmLeftWrap.scrollTop($btmWrap.scrollTop());
      });
      $btmLeftWrap.on('scroll', function(event){
        $btmWrap.scrollTop($btmLeftWrap.scrollTop());
      });

      // scroll area move as window resize
      $(window).on('resize', function(){
          $btmWrap.css({width: $tableWrap.width() - freezedWidth});
          $btmLeftWrap.css({
            height: $tableWrap.height() - self.prop.headerH
          });
          $topWrap.css({
            width: $tableWrap.width() - freezedWidth
          });
      });
    }
  }
})(jQuery);
