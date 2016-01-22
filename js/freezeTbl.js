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
      colFreeze: 0,
      headFreeze: 1,
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
    getTableWidth: function(){
      return this.prop.headerInfo.reduce(function(preVal,curEle){
        return preVal + curEle.width;
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
      for(var i=0;i<this.prop.headFreeze;i++){
        $rows.eq(i).detach().appendTo($freezedHead);
        headerH += $rows.eq(i).find('span:first').height();
      }
      $innerWrap.css({
        top: headerH,
        height: $tableWrap.height() - headerH
      }).on('scroll',function(event){
        $freezedHead.css({
          left: -$innerWrap.scrollLeft()
        });
      });
    },
    freezeCol: function(colIndex){
      // var width = this.prop.$tableWrap.
    }
  }

  // function addScrollWrapper(){
  //   var $tableWrap = $(this);
  //   var $table = $(this).find('table').detach();
  //   $('<div>')
  //     .addClass('scrollWrap')
  //     .css({
  //       position: 'absolute',
  //       height: '100%',
  //       width: '100%',
  //       overflow: 'auto'
  //     })
  //     .appendTo($tableWrap)
  //     .append($table);
  // }

  // freezeHeader: function(){
  //   var $scrollWrap = this.prop.$tableWrap.find('.scrollWrap');
  //   var tableWrapH = this.prop.$tableWrap.height();
  //   var $thead = this.prop.$tableWrap.find('thead');
  //   var headerH = $thead.height();
  //   var $table = this.prop.$tableWrap.find('table');
  //   $table.css({
  //     diaplay: 'block'
  //   });
  //   this.prop.$tableWrap.css({
  //     'padding-top': headerH
  //   });
  //   $scrollWrap.on('scroll',function(event){
  //     $thead.css({
  //       left: -$scrollWrap.scrollLeft()
  //     });
  //   });
  //   $thead.css({
  //     position: 'absolute',
  //     top: '0px'
  //   });
  // },
})(jQuery);
