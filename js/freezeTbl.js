(function($){
  $.fn.freezeTbl = function(param){

    var settings = $.extend({

    },param);
    return this.each(function(){
      console.log('do something');
      var instance = new TestClass('1231');
      instance.yoho();
    });
  }

  function TestClass(name){
    this.name = name || 'ddd';
  }

  TestClass.prototype.yoho = function(){
    console.log(this.name);
  }
})(jQuery);
