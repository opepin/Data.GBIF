$(function(){
  var helpPopover = (function() {
    var el;
    var displayed = false;
    var $popover;
    var transitionSpeed = 150;
    var title;
    var message;

    var template="<div class='yellow_popover'><div class='t'></div><div class='c'><h3><%= title %></h3><%= message %></div><div class='b'></div></div>";

    function hide() {
      if (displayed) {
        $('html').unbind("click");
        $popover.animate({top:$popover.position().top - 20,opacity:0}, transitionSpeed, function() { $popover.remove(); displayed = false; });
      }
    }

    function show(e, event, opt) {
      if (!displayed){
        el = e;

        if (opt) {
          title   = opt.title;
          message = opt.message;
        }

        var rendered_template = _.template(template, {title:title, message:message});
        $("#content").prepend(rendered_template);

        $popover = $(".yellow_popover");

        // get the coordinates and width of the popover
        var x = el.offset().left;
        var y = el.offset().top ;
        var w = $popover.width();
        var h = $popover.height();

        // center the popover
        $popover.css("left", x - w/2 + 7);
        $popover.css("top", y - h);

        $popover.animate({opacity:1}, transitionSpeed, function() { displayed = true; });
      }
    }

    return {
      show: show,
      hide: hide
    };
  })();

  var selectBox = (function() {
    var el;
    var selectedOptionText = "";
    var displayed = false;
    var $popover;
    var transitionSpeed = 200;

    function toggle(e, event, opt) {
      event.stopPropagation();

      el = e;

      if (opt) {
        transitionSpeed = opt.transitionSpeed;
        transitionSpeed = opt.transitionSpeed;
      }

      displayed ? hide(): show();
    }

    function select_option(option_text) {
      selectedOptionText = option_text;
      $popover.find("a").removeClass("selected");
      var selected_option = $('a *:contains('+selectedOptionText+')');
      selected_option.parent().addClass("selected");
    }

    function hide() {
      $('html').unbind("click");
      el.removeClass("selected");
      displayed = false;
    }

    $('.example div.white_scrollable_popover ul').jScrollPane({ verticalDragMinHeight: 20});

    function show() {
      el.toggleClass("selected");
      el.find('ul').jScrollPane({ verticalDragMinHeight: 20});
      displayed = true;

      // don't do anything if we click inside of the select…
      el.find('.listing, .jspVerticalBar').click(function(event) {
        event.stopPropagation();
      });

      // … but clicking anywhere else closes the popover
      $('html').click(function() {
        displayed && hide();
      });

      el.find("li").unbind("click");
      el.find("li").click(function(event) {
        var text = $(this).text();

        el.find("li").removeClass("selected");
        $(this).addClass("selected");

        if (text != selectedOptionText) {
          el.find("div.selected_option span").animate({ color: "#FFFFFF" }, transitionSpeed, function(){
            el.find("div.selected_option span").text(text);
            el.find("div.selected_option span").animate({ color: "#333" }, transitionSpeed);
          });
        }
        selectedOptionText = text;
        $("input#country").val(selectedOptionText);
        hide();
      });
    }

    return {
      toggle: toggle
    };
  })();

  var linkPopover = (function() {
    var el;
    var displayed = false;
    var $popover;

    var template = '<div class="white_narrow_popover">\
      <div class="arrow"></div>\
        <ul>\
          <li class="first"><a href="/countries/index.html"><span>Countries</span></a></li>\
            <li><a href="/members/index.html"><span>GBIF network</span></a></li>\
              <li><a href="/areas/index.html"><span>Areas</span></a></li>\
                <li><a href="/stats/index.html"><span>Stats</span></a></li>\
                  <li class="last"><a href="/static/about.html"><span>About</span></a></li>\
                    </ul>\
                      </div>';

    function toggle(e) {
      el = e;
      displayed ? hide(): show();
    }

    function hide() {
      $('html').unbind("click");
      $popover.slideUp("fast", function() { $popover.remove(); displayed = false; });
    }

    function show() {
      $("#content").prepend(template);
      $popover = $(".white_narrow_popover");

      // clicking anywhere closes the popover
      $('html').click(function() {
        displayed && hide();
      });

      // get the coordinates and width of the popover
      var x = el.find("span").offset().left;
      var y = el.find("span").offset().top;
      var w = $(".white_narrow_popover").width();

      // center the popover
      $popover.css("left", x - w/2 + 4);
      $popover.css("top", y - 5);

      $popover.slideDown("fast", function() { displayed = true; });
    }

    return {
      toggle: toggle
    };
  })();

  var sortPopover = (function() {
    var el;
    var selectedOptionText = "Sort by relevance";
    var displayed = false;
    var $popover;

    var template = '<div class="white_popover">\
      <div class="arrow"></div>\
        <ul>\
          <li class="first"><a href="#" class="relevance"><span>Sort by relevance</span></a></li>\
            <li><a href="#" class="occurrence"><span>Sort by ocurrence</span></a></li>\
              <li class="last"><a href="#" class="size"><span>Sort by size</span></a></li>\
                </ul>\
                  </div>';

    function toggle(e) {
      el = e;
      displayed ? hide(): show();
    }

    function select_option(option_text) {
      selectedOptionText = option_text;
      $popover.find("a").removeClass("selected");
      var selected_option = $('a *:contains('+selectedOptionText+')');
      selected_option.parent().addClass("selected");
    }

    function hide() {
      $('html').unbind("click");
      $popover.slideUp("fast", function() { $popover.remove(); displayed = false; });
    }

    function show() {
      $("#content").prepend(template);
      $popover = $(".white_popover");

      // clicking anywhere closes the popover
      $('html').click(function() {
        displayed && hide();
      });

      $popover.find("a").click(function(event){
        event.preventDefault();
        select_option($(this).text());
        el.html(selectedOptionText + "<span class='more'></span>");
        hide();
      });

      select_option(selectedOptionText);

      // get the coordinates and width of the popover
      var x = el.find("span").offset().left;
      var y = el.find("span").offset().top;
      var w = $(".white_popover").width();

      // center the popover
      $popover.css("left", x - w/2 + 4);
      $popover.css("top", y - 5);

      $popover.slideDown("fast", function() { displayed = true; });
    }

    return {
      toggle: toggle
    };
  })();

  $('nav ul li a.more').click(function(e){
    e.preventDefault();
    linkPopover.toggle($(this));
  });

  $('.sort').click(function(e){
    e.preventDefault();
    sortPopover.toggle($(this));
  });

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
  $("input[type='radio']").uniform();

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

  var downloadPopover = (function() {
    var displayed = false;
    var $login;
    var el;
    var explanation = "";
    var transitionSpeed = 200;
    var selected_template;

    var templates = { download_selector: "<article class='infowindow download_popover download_selector'>\
      <header></header>\
        <span class='close'></span>\
        <div class='content'>\
          <h2>DOWNLOAD DATA</h2>\
          <p><%= explanation %></p>\
            <div class='light_box'>\
            <h3>Select a format</h3>\
              <ul>\
                <li><input type='radio' name='format' value='csv' id='format_csv' /> <label for='format_csv'>CSV</label> <span class='size'>(≈150Kb)</span></li>\
                <li><input type='radio' name='format' value='xls' id='format_xls' /> <label for='format_xls'>XLS</label></li>\
                <li><input type='radio' name='format' value='xml' id='format_xml' /> <label for='format_xml'>XML</label></li>\
            </ul>\
            <div class='tl'></div><div class='tr'></div><div class='bl'></div><div class='br'></div>\
            </div>\
            <a class='candy_blue_button download' target='_blank' href='http://localhost:3000/img/download.zip'><span>Download</span></a>\
        </div>\
        <footer></footer>\
        </article>",
    direct_download: "<article class='infowindow download_popover direct_download'>\
      <header></header>\
      <span class='close'></span>\
        <div class='content'>\
          <h2>DOWNLOAD DATA</h2>\
            <div class='light_box package'>\
              <div class='content'>\
                <p><%= explanation %></p>\
              </div>\
            </div>\
            <span class='filetype'><strong>CSV file</strong> <span class='size'>(≈150Kb)</span></span> <a href='#' class='candy_blue_button download'><span>Download</span></a>\
        </div>\
        <footer></footer>\
       </article>",
    download_started: "<article class='infowindow download_has_started'>\
<header></header>\
<span class='close'></span>\
<div class='content'>\
  <h2>DOWNLOAD DATA</h2>\
  <p>Remember that the downloaded data has to be correctly cited if it is used in publications. You will receive a citation text vbundled in the file with your download.</p>\
  <p>If you have any doubt about the legal terms, please check our <a href='#' title='GBIF Data Terms and Conditions'>GBIF Data Terms and Conditions</a>.</p>\
  <a href='#' class='candy_white_button close'><span>Close</span></a>\
</div>\
<footer></footer>\
</article>"};

    function toggle(e, event, opt) {
      event.stopPropagation();
      event.preventDefault();
      el = e;

      selected_template = templates.download_selector;

      if (opt) {
        explanation = opt.explanation;
        if (opt.template && opt.template == "direct_download") {
          selected_template = templates.direct_download;
        }
      }

      displayed ? hide(): show();
    }

    function setupBindings() {
      $popover.find(".close").click(function(event) {
        event.preventDefault();
        console.log("Closing");
        displayed && hide();
      });

      $popover.click(function(event) {
        event.stopPropagation();
      });

      $('html').click(function() {
        displayed && hide();
      });
    }

    function showDownloadHasStarted(){
      $popover.animate({top:$popover.position().top - 20, opacity:0}, transitionSpeed, function() {

        // let's remove the old popover and unbind the old buttons
        $popover.find('a.download').unbind("click");
        $popover.find('a.close').unbind("click");
        $popover.remove();

        // we can now open the new popover: "download_has_started"
        rendered_template = _.template(templates.download_started);
        $("#content").prepend(rendered_template);
        $popover = $(".download_has_started");

        // bind everyhting so it keeps working
        setupBindings();

        $popover.css("top", (( $(window).height() - $popover.height()) / 2+$(window).scrollTop()) + 40 + "px");
        $popover.animate({top:$popover.position().top - 40, opacity:1}, transitionSpeed*2);
      });
    }

    function show() {
      var rendered_template = _.template(selected_template, {explanation:explanation});
      $("#content").prepend(rendered_template);
      $popover = $(".download_popover");

      $popover.find(".download").click(function(event) {
        console.log("Downloading");
        event.stopPropagation();
        event.preventDefault();
        //window.location.href = $(this).attr("href");

        var checked = $popover.find("ul li input:checked");

        showDownloadHasStarted();
      });

      setupBindings();
      $popover.css("top", ( $(window).height() - $popover.height()) / 2+$(window).scrollTop() + "px");
      $popover.fadeIn("slow", function() { hidden = false; });
      //$popover.draggable();
      $("body").append("<div id='lock_screen'></div>");
      $("#lock_screen").height($(document).height());
      $("#lock_screen").fadeIn("slow");
      displayed = true;
    }

    function hide(id) {

      $popover.find('a.close').unbind("click");
      $('html').unbind("click");

      //$popover.draggable(false);
      $popover.fadeOut("fast", function() { $popover.remove(); displayed = false; });
      $("#lock_screen").fadeOut("slow", function() { $("#lock_screen").remove(); });
    }

    return {
      toggle: toggle,
      hide: hide
    };
  })();

  $.fn.bindDownloadPopver = function(opt) {
    $(this).click(function(event) {
      downloadPopover.toggle($(this), event, opt);
    });
  };

  $.fn.bindHelpPopver = function(opt) {
    $(this).click(function(e) {
      e.preventDefault();
    });

    $(this).hover(function(e) {
      helpPopover.show($(this), e, opt);
    }, function(e){
      helpPopover.hide();
    });
  };

  $("a.help").bindHelpPopver({title:"Hi, I'm a yellow popover", message:"This is a <strong>message</strong>."});
  $("a.download").bindDownloadPopver({explanation:"Occurrences of “Puma concolor”, collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});
  $("a.download_2").bindDownloadPopver({template: "direct_download", explanation:"Occurrences of “Puma concolor”, collected between Jan 1sr, 2000 and Jan 1st, 2010, from dataset \"Felines of the world\"."});

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

  //  $('.search_button, .candy_white_button, .candy_blue_button').mousedown(function() { $(this).addClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseup(function() { $(this).removeClass('active'); });
  //  $('.search_button, .candy_white_button, .candy_blue_button').mouseleave(function() { $(this).removeClass('active'); });
});


