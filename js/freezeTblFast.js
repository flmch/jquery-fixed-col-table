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
      content: [],
      pageLimit: 100,
      freezedWidth: 0,
      unfreezedWidth: 0,
      totalWidth: 0,
      displayedWidth: 0,
      headerH: 60,
      rowHeight: 40
    },param);
    console.log(this.prop);
    this.createBasicStructure();
    console.time('header');
    this.displayHeader();
    console.timeEnd('header');
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
            'overflow': 'scroll',
            'width': '100%'
          })
          .on('scroll',function(event){ prop.$btmWrap.scrollLeft(prop.$topWrap.scrollLeft()); })
          .insertBefore(prop.$btmWrap);
        prop.$btmWrap.on('scroll',function(event){
          prop.$topWrap.scrollLeft(prop.$btmWrap.scrollLeft());
        })
        $(window).on('resize',function(){
          prop.$topWrap.css({width: prop.$container.width() - prop.freezedWidth});
          prop.$btmWrap.css({width: prop.$container.width() - prop.freezedWidth});
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
            // 'width' : prop.freezedWidth
          })
          .insertBefore(prop.$topWrap);
        prop.$btmLeftWrap = $('<div>')
          .addClass('btmLeftWrap')
          .css({
            'position':'absolute',
            'left' : '0px',
            'overflow': 'scroll',
            'height': prop.$container.height() - prop.headerH
            // 'width' : prop.freezedWidth
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
          prop.$btmWrap.css({height: prop.$container.height() - prop.headerH});
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
            // .text( isHeader ? headerInfo[i].title : dataObj[headerInfo[i].title] )
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
          newRowH = Math.max(newRowH, cell.scrollHeight);
        }
      });
      if( newRowH > oldRowH ){
          $rows.height(newRowH);
          $rowCells.height(newRowH);
      }
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
    displayContent: function(newContent){
      var self = this;
      var prop = self.prop;
      if( newContent ){ self.prop.content = newContent; }
      self.prop.content.forEach(function(data, index){
        self.displayRow(index, data);
      });
    }
    // createBasicStructure: function(){
    //   var self = this;
    //   self.prop.$container.empty();
    //   var $btmWrap = $('<div>')
    //       .addClass('btmWrap')
    //       .css({
    //         'position':'absolute',
    //         'width': '100%',
    //         'height': '100%',
    //         'overflow': 'auto'
    //       })
    //       .appendTo(self.prop.$container);
    //   self.prop.$btmWrap = $btmWrap;
    //   self.prop.tableWidth = self.getTableWidth();
    //
    //   // header row
    //   var $headRow = $('<div>').addClass('tableRow').css({width: self.prop.tableWidth, height: '0px'}).appendTo($btmWrap);
    //   self.prop.headerInfo.forEach(function(ele){
    //     var $curSpan = $('<span>')
    //       .text(ele.title)
    //       .addClass('tblHd')
    //       .css({float: 'left', display: 'inline-block', width: ele.width,'box-sizing': 'border-box'})
    //       .appendTo($headRow);
    //     $headRow.css({height: Math.max($headRow.height(),$curSpan.height()) + 'px' });
    //   });
    //   $headRow.find('span').height($headRow.height());
    //
    //   // content rows
    //   self.prop.content.forEach(function(row,index){
    //     var $newRow = $('<div>').addClass('tableRow record-'+index).css({width: self.prop.tableWidth, height: '0px'}).appendTo($btmWrap);
    //     self.prop.headerInfo.forEach(function(ele){
    //       var $curSpan = $('<span>')
    //         .text( row[ele.title] )
    //         .addClass(ele.title)
    //         .css({float: 'left', display: 'inline-block', width: ele.width, 'box-sizing': 'border-box'})
    //         .appendTo($newRow);
    //       $newRow.css({height: Math.max($newRow.height(),$curSpan.height()) + 'px' });
    //     });
    //     $newRow.find('span').height($newRow.height());
    //   });
    //   $('body').css('overflow','hidden');
    // },
    // freezeHeader: function(){
    //   var headerH = 0;
    //   var $container = this.prop.$container;
    //   var $btmWrap = this.prop.$btmWrap;
    //   var $rows = $btmWrap.find('.tableRow');
    //   var $topWrap = $('<div>')
    //         .addClass('topWrap')
    //         .insertBefore($btmWrap)
    //         .css({position: 'absolute', overflow: 'scroll', width: $container.width()})
    //         .on('scroll',function(event){ $btmWrap.scrollLeft($topWrap.scrollLeft()); });
    //   // if( this.prop.content.length ){ $topWrap.css({'overflow': 'scroll'}); }
    //   for(var i=0;i<this.prop.headNum;i++){
    //     $rows.eq(i).detach().appendTo($topWrap);
    //     headerH += $rows.eq(i).height();
    //   }
    //   $btmWrap.css({
    //     top: headerH,
    //     height: $container.height() - headerH,
    //     'z-index': 20,
    //     'background-color': 'white'
    //   }).on('scroll', function(event){ $topWrap.scrollLeft($btmWrap.scrollLeft()); });
    //   $(window).on('resize', function(){
    //       $btmWrap.css({height: $container.height() - headerH});
    //   });
    //   this.prop.headerH = headerH;
    // },
    // freezeCol: function(){
    //   var self = this;
    //   var freezedWidth = this.getTableWidth(this.prop.colNum);
    //   var $container = this.prop.$container;
    //   var $btmWrap = this.prop.$btmWrap;
    //
    //   // top left section
    //   var $topWrap = $container.find('.topWrap');
    //   var $headRows = $topWrap.find('> div');
    //   var $topLeftWrap = $('<div>')
    //         .addClass('topLeftWrap')
    //         .insertBefore($topWrap)
    //         .css({
    //           'z-index': 20
    //         });
    //   self.shiftCells($topWrap,$topLeftWrap);
    //
    //   // bottom left section
    //   var $btmLeftWrap = $('<div>')
    //         .addClass('btmLeftWrap')
    //         .insertBefore($btmWrap)
    //   if( self.prop.content.length ){ $btmLeftWrap.css({'overflow': 'scroll'}); }
    //   self.shiftCells($btmWrap,$btmLeftWrap);
    //   $btmWrap.on('scroll', function(event){
    //     $btmLeftWrap.scrollTop($btmWrap.scrollTop());
    //   });
    //   $btmLeftWrap.on('scroll', function(event){
    //     $btmWrap.scrollTop($btmLeftWrap.scrollTop());
    //   });
    //
    //   // scroll area move as window resize
    //   $(window).on('resize', function(){
    //       $btmWrap.css({width: $container.width() - freezedWidth});
    //       $topWrap.css({width: $container.width() - freezedWidth});
    //       $btmLeftWrap.css({height: $container.height() - self.prop.headerH});
    //   });
    // },
    // shiftCells: function($wrapFrom, $wrapTo){
    //   var self = this;
    //   var $container = self.prop.$container;
    //   var $rows = $wrapFrom.find('.tableRow');
    //   var freezedWidth = self.getTableWidth(self.prop.colNum);
    //
    //   $rows.each(function(index,row){
    //     var $spans = $(this).find('span');
    //     var $newRow = $('<div>')
    //           .addClass('tableRow')
    //           .css({width: freezedWidth, height: $(row).height() })
    //           .appendTo($wrapTo);
    //     for(var i=0;i<self.prop.colNum;i++){
    //       $spans.eq(i).detach().appendTo($newRow);
    //     }
    //     $(this).css({width: $(this).width() - freezedWidth});
    //   });
    //   $wrapFrom.css({left: freezedWidth, width: $container.width() - freezedWidth});
    //   $wrapTo.css({position: 'absolute', top: $wrapFrom.css('top'), height: $wrapFrom.height()});
    // },
    // updateContent: function(newContent){
    //
    //   this.prop.content = newContent;
    //   console.log(this.prop);
    //   this.init();
    // }
  });

})(jQuery);
