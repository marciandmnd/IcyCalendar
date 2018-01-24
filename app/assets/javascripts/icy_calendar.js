const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
"JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

// Internal API for modifying the Calendar UI
var IcyCalendar = {
  cache: {},
  refreshCtx: function(year, month) {
    this.ctx.year = year;
    this.ctx.month = month;
    this.ctx.$weekRows = $('table tr.week');

    $('td').on('click', function(){
      window.location = $(this).data('show-path');
    });
  },
  init: function(year, month) {
    history.replaceState({view: 'mo', year: year, month: month}, null, null);
    
    var _this = this;
    _this.view = 'mo'
    _this.ctx = {
      month: month,
      year: year,
      $viewSelect: $('#view-select'),
      $weekRows: $('table tr.week')
    };

    // History API popstate handling
    window.addEventListener('popstate', function(e) {
      // console.log(e.state);
      switch(e.state.view) {
        case 'mo':
          _this.showCalendarNavigation();
          break;
        case 'wk':
          // if different month, load calendar from cache
          if(e.state.month != _this.ctx.month) {
            var cacheKey = 'y' + e.state.year + 'm' + e.state.month;
            $('.calendar-wrapper').html(_this.cache[cacheKey]);
            _this.update(e.state.year, e.state.month);
          }
          _this.showWeekNavigation(e.state.row);
          break;
        default:
          return;
      }
    });


    //*** BEGIN calendar navigation event handlers ***//
    var $nextWeek = $('a#next-week');
    var $prevWeek = $('a#prev-week');
    
    $nextWeek.on('click', function(e) {
      e.preventDefault();
      
      var currWeekIndex = $($('tr.week:visible')[0]).data('week-index');
      var nextWeekIndex = currWeekIndex + 1;

      _this.ctx.$weekRows.hide();
      $(_this.ctx.$weekRows[nextWeekIndex]).show();

      history.pushState({view: 'wk', row: nextWeekIndex, month: _this.ctx.month, year: _this.ctx.year }, null, null);
    });

    $prevWeek.on('click', function(e) {
      e.preventDefault();
      
      var currWeekIndex = $($('tr.week:visible')[0]).data('week-index');
      var prevWeekIndex = currWeekIndex - 1;
      
      // TODO load from cache
      // Get previous month calendar
      if(prevWeekIndex < 0) {
        if(_this.ctx.month == 1) {
          _this.ctx.month = 12
          _this.ctx.year -= 1
        }
        else {
          _this.ctx.month -= 1;
        }
        if(_this.cache['y' + _this.ctx.year + 'm' + _this.ctx.month]) {
          $('.calendar-wrapper').html(_this.cache['y' + _this.ctx.year + 'm' + _this.ctx.month]);
          var row = $('tr.week').length - 1;
          history.pushState({view: 'wk', row: row, month: _this.ctx.month, year: _this.ctx.year}, null, '/calendars/' + _this.ctx.year + "/" + _this.ctx.month);
        }
        else {
          $.ajax({
            url:  "/async_calendar/" + _this.ctx.year + "/" + _this.ctx.month,
            success: function(data) {
              $('.calendar-wrapper').html(data);
              _this.update(_this.ctx.year, _this.ctx.month);
              _this.ctx.$weekRows.hide();
              
              var row = $('tr.week').length - 1;
              $(_this.ctx.$weekRows[row]).show();
              
              history.pushState({view: 'wk', row: row, month: _this.ctx.month, year: _this.ctx.year}, null, '/calendars/' + _this.ctx.year + "/" + _this.ctx.month);
            },
            dataType: 'html'
          });
        }
      }
      else {
        history.pushState({view: 'wk', row: prevWeekIndex, month: _this.ctx.month, year: _this.ctx.year }, null, null);
        $('table tr.week').hide();
        $($('table tr.week')[prevWeekIndex]).show();
      }
    });

    $('td').on('click', function(){
      window.location = $(this).data('show-path');
    });
    //*** END calendar navigation event handlers ***//

    // M select box
    _this.ctx.$viewSelect.select();
    _this.ctx.$viewSelect.on('change', function(e){
      var value = _this.ctx.$viewSelect.val();
      switch(value) {
        case 'month':
          _this.view = 'mo';
          _this.showCalendarNavigation();
          history.pushState({view: 'mo', month: _this.ctx.month, year: _this.ctx.year }, null, null);
          break;
        case 'week':
          _this.view = 'wk';
          _this.showWeekNavigation();
          history.pushState({view: 'wk', row: 0, month: _this.ctx.month, year: _this.ctx.year }, null, null);
          break;
        case 'day':
          break;
        default:
          break;
      }
    });

    // Cache initial calendar
    const cacheKey = 'y' + _this.ctx.year + 'm' + _this.ctx.month
    _this.cache[cacheKey] = $('.calendar-wrapper').html();
  },
  // Update context when new cal is loaded
  update: function(year, month) {
    this.refreshCtx(year, month);
    
    const cacheKey = 'y' + year + 'm' + month;
    if(!this.cache[cacheKey]) {
      this.cache['y' + year + 'm' + month] = $('.calendar-wrapper').html();
    }

    $('#month-name').text(monthNames[month-1]);
    $('#year').text(year);

    // Update calendar navigation links
    if(month-1 == 0) {
      $('#prev-month-link').attr('href', '/calendars/' + (year - 1) + '/' + 12);
    }
    else {
      $('#prev-month-link').attr('href', '/calendars/' + year + '/' + (month - 1));
    }

    if(month+1 == 13) {
      $('#next-month-link').attr('href', '/calendars/' + (year + 1) + '/' + 1);
    }
    else {
      $('#next-month-link').attr('href', '/calendars/' + year + '/' + (month + 1));
    }

    $('#next-year-link').attr('href', '/calendars/' + (year + 1) + '/' + month);
    $('#prev-year-link').attr('href', '/calendars/' + (year - 1) + '/' + month);
  },
  showCalendarNavigation: function() {
    this.setViewSelect(0);

    $('.calendar-navigation').show();
    $('.week-navigation').hide();
    
    this.ctx.$weekRows.show();
  },
  showWeekNavigation: function(weekIndex=0) {
    this.setViewSelect(1);

    $('.calendar-navigation').hide();
    $('.week-navigation').show();
    
    this.ctx.$weekRows.hide()
    $(this.ctx.$weekRows[weekIndex]).show();
  },
  // reset M select box
  setViewSelect: function(i) { 
    document.getElementById("view-select").selectedIndex = i;
    this.ctx.$viewSelect.select();
  }
};