(function($){
  $.fn.freezeTbl = function(param){
    param.$container = param.$container || $(this);
    return new freezeTbl(param);
  }

  function freezeTbl(param){
    this.prop = $.extend((this.prop || {}),{
      colNum: 0,
      headNum: 1,
      headerInfo: [],
      pageLimit: 100,
      freezedWidth: 0,
      unfreezedWidth: 0,
      totalWidth: 0,
      displayedWidth: 0,
      headerH: 40,
      rowHeight: 35
    },param);
    this.createBasicStructure();
    // console.time('header');
    this.displayHeader();
    // console.timeEnd('header');
  }

  freezeTbl.prototype = $.extend((freezeTbl.prototype || {}),{
    getTableWidth: function(colNum){
      return this.prop.headerInfo.reduce(function(preVal,curEle,index){
        return preVal +  ( (!colNum || index+1 <= colNum) ? (+curEle.width) : 0 );
      },0)
    },
    createBasicStructure: function(){
      var self = this;
      var prop = self.prop;
      prop.$container.empty();
      prop.$container.css({overflow: 'hidden'})
      $('body').css('overflow','hidden');
      prop.displayedWidth = prop.$container.width();
      prop.totalWidth = self.getTableWidth();
      prop.unfreezedWidth = prop.totalWidth;
      prop.$btmWrap = $('<div>')
          .addClass('btmWrap')
          .css({
            'position':'absolute',
            'overflow': 'auto',
            'width': '100%',
            'background-color': 'white'
          })
          .appendTo(prop.$container);
      if( prop.headNum ){
        prop.$topWrap = $('<div>')
          .addClass('topWrap')
          .css({
            'position':'absolute',
            'top' : '0px',
            'overflow': 'auto',
            'width': '100%'
          })
          .on('scroll',function(event){ prop.$btmWrap.scrollLeft(prop.$topWrap.scrollLeft()); })
          .insertBefore(prop.$btmWrap);
        prop.$btmWrap.on('scroll',function(event){
          prop.$topWrap.scrollLeft(prop.$btmWrap.scrollLeft());
        })
        $(window).on('resize',function(){
          prop.$topWrap.css({width: prop.$container.width() - prop.freezedWidth});
          prop.$btmWrap.css({
            width: prop.$container.width() - prop.freezedWidth,
            height: prop.$container.height() - prop.headerH});
          self.refreshScrollbar();
        });
      }
      if( prop.colNum ){
        prop.freezedWidth = self.getTableWidth(this.prop.colNum);
        prop.unfreezedWidth = prop.totalWidth - prop.freezedWidth;
        prop.$topLeftWrap = $('<div>')
          .addClass('topLeftWrap')
          .css({
            'position':'absolute',
            'top' : '0px',
            'left' : '0px'
          })
          .insertBefore(prop.$topWrap);
        prop.$btmLeftWrap = $('<div>')
          .addClass('btmLeftWrap')
          .css({
            'position':'absolute',
            'left' : '0px',
            'overflow': 'scroll',
            'height': prop.$container.height() - prop.headerH
          })
          .insertBefore(prop.$btmWrap)
          .on('scroll',function(event){ prop.$btmWrap.scrollTop(prop.$btmLeftWrap.scrollTop()); });;
        prop.$topWrap
          .css({left: prop.freezedWidth, width: prop.displayedWidth - prop.freezedWidth});
        prop.$btmWrap
          .css({
            left: prop.freezedWidth,
            width: prop.displayedWidth - prop.freezedWidth,
            height: prop.$container.height() - prop.headerH})
          .on('scroll',function(event){
            prop.$btmLeftWrap.scrollTop(prop.$btmWrap.scrollTop());
          });
        $(window).on('resize', function(){
          prop.$btmLeftWrap.css({height: prop.$container.height() - prop.headerH});
        });
      }

      for(var h = 0; h < prop.headNum; h++){
        this.createRow( h, prop.$topLeftWrap, 0, prop.colNum, prop.freezedWidth);
        this.createRow( h, prop.$topWrap, prop.colNum, prop.headerInfo.length, prop.unfreezedWidth);
      }
      for(h = prop.headNum; h <= prop.pageLimit; h++){
        this.createRow( h, prop.$btmLeftWrap, 0, prop.colNum, prop.freezedWidth);
        this.createRow( h, prop.$btmWrap, prop.colNum, prop.headerInfo.length, prop.unfreezedWidth);
      }

    },
    createRow: function(level, $target, start, end, rowWidth){
      var self = this;
      var headerInfo = self.prop.headerInfo;
      start = start || 0;
      end = end || headerInfo.length;

      if( end > start ){
        var $newRow = $('<div>').addClass('tableRow').css({
          width: (start == 0 ? self.freezedWidth : self.unfreezedWidth),
          height: (level == 0? self.prop.headerH : self.prop.rowHeight)
        })
        .addClass( level == 0 ? 'tblHead' : 'record-'+(level-1) )
        .appendTo($target);
        if(rowWidth){ $newRow.css({width: rowWidth}); }
        for(var i = start; i < end; i++){
          $curCell = $('<span>')
            .css({
              float: 'left',
              display: 'inline-block',
              width: headerInfo[i].width,
              height: (level == 0? self.prop.headerH : self.prop.rowHeight),
              overflow: 'hidden'
            })
            .appendTo($newRow);
          if( level ){ $curCell.addClass(headerInfo[i].title); }
        }
        return $newRow;
      }
    },
    displayRow: function(level, dataObj){
      var self = this;
      var $rows = self.prop.$container.find('.'+ (level === undefined ? 'tblHead' : 'record-'+level ) );
      var $rowCells = $rows.find('span');
      var newRowH = this.prop.rowHeight;
      var oldRowH = newRowH;
      $rowCells.each(function(index,cell){
        var title = self.prop.headerInfo[index].title;
        if( title != undefined ){
          $(cell).text( level === undefined ? title : dataObj[title]);
          // newRowH = Math.max(newRowH, cell.scrollHeight);
        }
      });
      // if( newRowH > oldRowH ){
      //     $rows.height(newRowH);
      //     $rowCells.height(newRowH);
      // }
      $rows.show();

    },
    displayHeader: function(){
      var prop = this.prop;
      // prop.headerH = this.displayRow();
      this.displayRow();
      if( prop.$btmWrap ){
        prop.$btmWrap.css({top: prop.headerH, height: prop.$container.height() - prop.headerH});
      }
      if( prop.$btmLeftWrap ){
        prop.$btmLeftWrap.css({top: prop.headerH, height: prop.$container.height() - prop.headerH});
      }
    },
    displayContent: function(content){
      var self = this;
      var prop = self.prop;
      content = content || [];
      content.forEach(function(data, index){
        self.displayRow(index, data);
      });
      for(var i = content.length; i < prop.pageLimit ; i++ ){
        prop.$container.find('.record-'+i).hide();
      }
      self.refreshScrollbar();
    },
    refreshScrollbar: function(){
      var $btmWrap = this.prop.$btmWrap;
      var $topWrap = this.prop.$topWrap;
      var btmWrapScrollW = $btmWrap[0].scrollWidth;
      var btmWrapScrollH = $btmWrap[0].scrollHeight;
      var btmWrapInnerH = $btmWrap.innerHeight();
      var $tableRows = $topWrap.find('.tableRow');
      if( btmWrapInnerH < (btmWrapScrollH + 15) ){
        $tableRows.width( btmWrapScrollW + 15 );
      }else{
        $tableRows.width(btmWrapScrollW);
      }
    }
  });
})(jQuery);
