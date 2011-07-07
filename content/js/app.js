$(function(){
  var dataHistory = (function() {
    var width, height, canvas, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth;
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DEC"];
    var template =  _.template("L<%= xpos %>.5 <%= old_ypos %>.5, L<%= xpos %>.5 <%= ypos %>.5,");
    var processes = {};
    var max, stepWidth, leftover;
    var normalized_values = [];

    function initialize(opt) {
      width  = $("#holder").width();
      height = opt.height || 180;

      fillColor     = opt.fillColor     || "#000000";
      fillOpacity   = opt.fillOpacity   || ".08";
      strokeColor   = opt.strokeColor   || "#D9D9D9";
      strokeOpacity = opt.strokeOpacity || ".08";
      strokeWidth   = opt.strokeWidth   || "1";

      if (opt.processes) {
        processes     = opt.processes.dates;
      }

      canvas = Raphael("holder", width, height + 57);

      max = _.max(values);
      normalized_values = _.map(values, function(v) { return height - Math.round(v  * height/max); });

      stepWidth    = Math.floor(width / values.length);
      bigStepWidth = Math.ceil(width / values.length);

      leftover     = Math.abs(stepWidth*values.length - width);
      //console.log("Step: " + stepWidth, "bigStep: " + bigStepWidth, bigStepWidth*leftover, "Leftover: " + leftover + " px");
    }

    function drawLines() {
      var path  = "M0 " + height + " ";
      var previous_value = height;

      _.each(normalized_values, function(value, index) {
        path += template({xpos:stepWidth*index, ypos:value, old_ypos:previous_value});
        previous_value = value;
      });

      path += template({xpos:stepWidth*values.length, ypos:height, old_ypos:previous_value});

      var shape = canvas.path(path);
      shape.attr("stroke", strokeColor);
      shape.attr("stroke-width", strokeWidth);
    }

    function drawMonthLine(x, monthName) {
      var monthWidth = Math.round(stepWidth*values.length / 12);

      var line = canvas.path("M"+x+".5 450.5 L"+x+".5 0");
      line.attr("stroke", "#D9D9D9");

      if (monthName) {
        var month = canvas.text(x + Math.round(monthWidth/2), height + 50, monthName);
        month.attr("fill", "#ccc");
      }
    }

    function drawMonthLines() {
      var monthWidth = Math.round(stepWidth*values.length / 12);

      for (i = 0; i < 12; i++) {
        var line = canvas.path("M"+monthWidth*i+".5 450.5 L"+monthWidth*i+".5 0");
        line.attr("stroke", "#D9D9D9");
        var month = canvas.text(monthWidth*i + Math.round(monthWidth/2), height + 50, months[i]);
        month.attr("fill", "#ccc");
      }

      var line = canvas.path("M"+(stepWidth*values.length)+".5 450.5 L"+(stepWidth*values.length)+".5 0");
      line.attr("stroke", "#D9D9D9");
    }

    function drawRects() {
      _.each(normalized_values, function(value, index) {
        var rect = canvas.rect(stepWidth*index + ".5", value + ".5", stepWidth, height - value + 20);

        rect.attr("fill-opacity", fillOpacity);
        rect.attr("fill", fillColor);
        rect.attr("stroke-width", "0");

        rect.hover(function (event) { this.attr({fill: "#D9D9D9"}); }, function (event) { this.attr({fill: "#000"}); });

        rect.click(function (event) {
          var d = new Date(2011, 0, index);
          alert(index + ": " + d);
        });

        var date = new Date(2011, 0, index);

        if (index == 1)  {
          drawMonthLine(0, months[date.getMonth() ]);
        } else if (date.getDate() === 1)  {
          drawMonthLine(stepWidth*index, months[date.getMonth() ]);
        } else if (index == 365) {
          drawMonthLine(width - 1);
        }
      });
    }

    function daysBetween(firstDate, lastDate) {
      return Math.abs((firstDate.getTime() - lastDate.getTime())/(24*60*60*1000));
    }

    function numberOfDay(date) {
      var firstDate = new Date("2011-1-1");
      return Math.round(Math.abs((firstDate.getTime() - date.getTime())/(24*60*60*1000)));
    }

    function drawPoint(x, y) {
      var rect = canvas.rect(x, y, 6, 6, 3);

      rect.attr("fill", "#0099CC");
      rect.attr("stroke-width", "0");
    }

    function drawLine(x, y, width) {
      var rect = canvas.rect(x, y, width, 6, 3);

      rect.attr("fill", "#0099CC");
      rect.attr("stroke-width", "0");
    }

    function drawProcesses() {
      _.each(processes, function(date) {
        //console.log(date);
        var startDate = new Date(date.start);
        var endDate   = new Date(date.end);

        x = numberOfDay(startDate);
        y = numberOfDay(endDate);

        var days = daysBetween(startDate, endDate);

        if (days) {
          //console.log(startDate, endDate, x, y, y - x, p*stepWidth);
          drawLine(x*stepWidth + 1, 210, (y-x)*stepWidth + stepWidth*2);
        } else {
          drawPoint(x*stepWidth + 1, 210);
        }
      });
    }

    function drawGraph(values) {
      drawLines();
      //drawMonthLines();
      drawRects();
      drawProcesses();
    }

    return {
      initialize: initialize,
      show: drawGraph
    };
  })();

  function generateRandomValues(limit) {
    var last = 0;
    var values = [];

    for (var i=0; i<=limit; i++) {
      if (Math.random()*100 > 90) {
        values[i] = Math.floor(Math.random()*20);
      } else {
        values[i] = last;
      }
      last = values[i];
    }
    return values;
  }
  var values = generateRandomValues(365);

  var processes = { dates:[
    {start:"2011-1-1", end: "2011-2-11"},
    {start:"2011-3-1"}
  ]};

  if ($("#holder").length ) {
    dataHistory.initialize({height: 180, processes: processes});
    dataHistory.show(values);
  }

  $('div.graph').each(function(index) {
    $(this).find('ul li .bar').each(function(index) {
      var width = $(this).parents("div").attr("class").replace(/graph /, "");
      $(this).parent().css("width", width);

      var value = $(this).text();

      $(this).delay(index*100).animate({ height: value }, 400, 'easeOutBounce');
    });
  });

  $('.dropdown').click(function(e){
    e.preventDefault();
    $(this).toggleClass("selected");
  });

  $('div.graph ul li a').click(function(e){
    e.preventDefault();
  });

  $("select").uniform();

  var infoWindow = (function() {
    var displayed = false;
    var $login;
    var el;

    function toggle(e, event) {
      event.stopPropagation();
      event.preventDefault();
      el = $("#"+e);
      displayed ? hide(): show();
    }

    function show() {
      el.find(".close").click(function(event) {
        event.preventDefault();
        displayed && hide();
      });

      el.click(function(event) {
        event.stopPropagation();
      });

      $('html').click(function() {
        displayed && hide();
      });

      el.css("top", ( $(window).height() - el.height()) / 2+$(window).scrollTop() + "px");
      el.fadeIn("slow", function() { hidden = false; });
      el.draggable();
      $("body").append("<div id='lock_screen'></div>");
      $("#lock_screen").height($(document).height());
      $("#lock_screen").fadeIn("slow");
      displayed = true;
    }

    function hide(id) {
      el.find('a.close').unbind("click");
      $('html').unbind("click");
      el.draggable(false);
      el.fadeOut("slow");
      $("#lock_screen").fadeOut("slow", function() { displayed = false; $("#lock_screen").remove(); });
    }

    return {
      toggle: toggle,
      hide: hide
    };
  })();

  //$.fn.bindFilterPopover = function(opt) {
  //  $(this).live("click", function(event) {
  //    var c = filterPopover();
  //    c.toggle($(this), event, opt);
  //  });
  //};

  $.fn.bindDownloadPopover = function(opt) {
    $(this).click(function(event) {
      downloadPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindLoginPopover = function(opt) {
    $(this).click(function(event) {
      loginPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindSortPopover = function() {
    $(this).click(function(event) {
      sortPopover.toggle($(this), event);
    });
  };

  $.fn.bindLinkPopover = function() {
    $(this).click(function(event) {
      linkPopover.toggle($(this), event);
    });
  };

  $.fn.bindHelpPopover = function(opt) {
    $(this).click(function(event) {
      helpPopover.toggle($(this), event, opt);
    });
  };

  // Bindings
  var c = filterPopover();
  $("a.filter").click(function(event){
    c.toggle($(this), event);
  });

  $("a.help").bindHelpPopover({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong> with a <a href='http://www.gbif.org/'>link</a>."});
  $("a.download").bindDownloadPopover({explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.download_2").bindDownloadPopover({template: "direct_download", explanation:"Occurrences of \"Puma concolor\", collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.login").bindLoginPopover();
  $('nav ul li a.more').bindLinkPopover();
  $('.sort').bindSortPopover();

  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // esc key
      downloadPopover.hide();
    }
  });

  $('span.input_text input').focus(function() {
    $(this).parent().addClass("focus");
  });

  $('span.input_text input').focusout(function() {
    $(this).parent().removeClass("focus");
  });

  $('.select-box div.selected_option').click(function(e) {
    selectBox.toggle($(this).parent(), e);
  });

  $( "#slider-range" ).slider({
    range: true,
    min: 0,
    max: 500,
    values: [ 75, 300 ],
    slide: function( event, ui ) {
      $( "#range" ).val( "BETWEEN " + ui.values[ 0 ] + " AND " + ui.values[ 1 ] );
    }
  });

  $( "#range" ).val( "BETWEEN " + $( "#slider-range" ).slider( "values", 0 ) + " AND " + $( "#slider-range" ).slider( "values", 1 ) );

  $.fn.bindSlideshow = function(opt) {
    var $this = $(this);
    var photo_width = 627;
    var currentPhoto = 0;
    var num_of_photos = $this.find("div.photos > img").length - 1;
    var downloads = $this.find("div.download a");

    var $previous_button = $this.find(".previous_slide");
    var $next_button = $this.find(".next_slide");

    $previous_button.addClass("disabled");

    $this.find(".photos").width(num_of_photos*photo_width);

    $previous_button.click(function(event) {
      event.preventDefault();
      if (currentPhoto > 0) {
        $next_button.removeClass("disabled");
        $this.find('.slideshow').scrollTo('-=627px', 500,{easing:'easeOutQuart', axis:'x'});
        $(downloads[currentPhoto]).parent().hide();
        currentPhoto--;
        $(downloads[currentPhoto]).parent().show();

        if (currentPhoto == 0) {
          $previous_button.addClass("disabled");
        }
      }
    });

    $next_button.click(function(event) {
      event.preventDefault();
      if (currentPhoto < num_of_photos) {
        $previous_button.removeClass("disabled");

        $this.find('div.content div.slideshow').scrollTo("+=627px", 500, {easing:'easeOutQuart', axis:'x'});
        $(downloads[currentPhoto]).parent().hide();
        currentPhoto++;
        $(downloads[currentPhoto]).parent().show();

        if (currentPhoto >= num_of_photos) {
          $next_button.addClass("disabled");
        }

      }
    });
  };

  $("article#slideshow-1").bindSlideshow();

  //  $(".select-filter ul").jScrollPane({ verticalDragMinHeight: 20});
  //  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});


