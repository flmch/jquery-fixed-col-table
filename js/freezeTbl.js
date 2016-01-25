(function($){
  $.fn.freezeTbl = function(param){
    param.$container = param.$container || $(this);
    return new freezeTbl(param);
  }

  function freezeTbl(param){
    this.prop = $.extend((this.prop || {}),{
    },param);
    console.log(this.prop);
    this.init();
  }

  freezeTbl.prototype = $.extend((freezeTbl.prototype || {}),{
    init: function(){
      this.createBasicStructure();
      if( this.prop.headNum ){ this.freezeHeader(); }
      if( this.prop.colNum ){ this.freezeCol(); }
    },
    getTableWidth: function(colNum){
      return this.prop.headerInfo.reduce(function(preVal,curEle,index){
        return preVal +  ( (!colNum || index+1 <= colNum) ? curEle.width : 0 );
      },0)
    },
    createBasicStructure: function(){
      var self = this;
      self.prop.$container.empty();
      var $btmWrap = $('<div>')
          .addClass('btmWrap')
          .css({
            'position':'absolute',
            'width': '100%',
            'height': '100%',
            'overflow': 'auto'
          })
          .appendTo(self.prop.$container);
      self.prop.$btmWrap = $btmWrap;
      self.prop.tableWidth = self.getTableWidth();

      var $headRow = $('<div>').addClass('tableRow').css({width: self.prop.tableWidth}).appendTo($btmWrap);
      self.prop.headerInfo.forEach(function(ele){
        $('<span>')
          .text(ele.title)
          .addClass('tblHd')
          .css({float: 'left', display: 'inline-block', width: ele.width, 'box-sizing': 'border-box'})
          .appendTo($headRow);
      });
      self.prop.content.forEach(function(row,index){
        var $newRow = $('<div>').addClass('tableRow record-'+index).css({width: self.prop.tableWidth}).appendTo($btmWrap);
        self.prop.headerInfo.forEach(function(ele){
          $('<span>')
            .text(row[ele.title])
            .addClass(ele.title)
            .css({float: 'left', display: 'inline-block', width: ele.width, 'box-sizing': 'border-box'})
            .appendTo($newRow);
        });
      });
    },
    freezeHeader: function(){
      var headerH = 0;
      var $container = this.prop.$container;
      var $btmWrap = this.prop.$btmWrap;
      var $rows = $btmWrap.find('.tableRow');
      var $topWrap = $('<div>')
            .addClass('topWrap')
            .insertBefore($btmWrap)
            .css({position: 'absolute', overflow: 'scroll', width: $container.width()})
            .on('scroll',function(event){ $btmWrap.scrollLeft($topWrap.scrollLeft()); });
      for(var i=0;i<this.prop.headNum;i++){
        $rows.eq(i).detach().appendTo($topWrap);
        headerH += $rows.eq(i).find('span:first').height();
      }
      $btmWrap.css({
        top: headerH,
        height: $container.height() - headerH,
        'z-index': 20,
        'background-color': 'white'
      }).on('scroll', function(event){ $topWrap.scrollLeft($btmWrap.scrollLeft()); });
      $(window).on('resize', function(){
          $btmWrap.css({height: $container.height() - headerH});
      });
      this.prop.headerH = headerH;
    },
    freezeCol: function(){
      var self = this;
      var freezedWidth = this.getTableWidth(this.prop.colNum);
      var $container = this.prop.$container;
      var $btmWrap = this.prop.$btmWrap;

      // top left section
      var $topWrap = $container.find('.topWrap');
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
      self.shiftCells($topWrap,$topLeftWrap);

      // bottom left section
      var $btmLeftWrap = $('<div>')
            .addClass('btmLeftWrap')
            .css({
              position: 'absolute',
              top: self.prop.headerH,
              height: $container.height() - self.prop.headerH,
              'overflow': 'scroll',
            })
            .insertBefore($btmWrap)
      self.shiftCells($btmWrap,$btmLeftWrap);
      $btmWrap.on('scroll', function(event){
        $btmLeftWrap.scrollTop($btmWrap.scrollTop());
      });
      $btmLeftWrap.on('scroll', function(event){
        $btmWrap.scrollTop($btmLeftWrap.scrollTop());
      });

      // scroll area move as window resize
      $(window).on('resize', function(){
          $btmWrap.css({width: $container.width() - freezedWidth});
          $topWrap.css({width: $container.width() - freezedWidth});
          $btmLeftWrap.css({height: $container.height() - self.prop.headerH});
      });
    },
    shiftCells: function($wrapFrom, $wrapTo){
      var self = this;
      var $container = self.prop.$container;
      var $rows = $wrapFrom.find('.tableRow');
      var freezedWidth = self.getTableWidth(self.prop.colNum);
      $rows.each(function(index,row){
        var $newRow = $('<div>')
              .addClass('tableRow')
              .css({width: freezedWidth})
              .appendTo($wrapTo);
        var $spans = $(this).find('span');
        for(var i=0;i<self.prop.colNum;i++){
          $spans.eq(i).detach().appendTo($newRow);
        }
        $(this).css({width: $(this).width() - freezedWidth});
      });
      $wrapFrom.css({left: freezedWidth,width: $container.width() - freezedWidth});
    },
    updateContent: function(newContent){
      // var self = this;
      // var newContentLen = newContent.length;
      // var curRecords = this.prop.$container.find('[class*=record]');
      // var curRecordsLen = Array.prototype.slice.call(curRecords).length;
      // curRecords.each(function(index,record){
      //   var newRecord = newContent[index];
      //   if( newRecord ){
      //     self.prop.headerInfo.forEach(function(info){
      //       $(record).find('.'+info.title+'').text(newRecord[info.title]);
      //     });
      //   }else{
      //     $(record).remove();
      //   }
      //   for(var i=curRecordsLen;i<newContentLen;i++){
      //     var $newRow = $('<div>').addClass('tableRow record-'+i).appendTo()
      //   }
      // });
      this.prop.content = newContent;
      console.log(this.prop);
      this.init();
    }
  });

})(jQuery);
