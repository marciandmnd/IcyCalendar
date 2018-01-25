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
    _this.view = 'mo';
    _this.ctx = {
      month: month,
      year: year,
      $weekRows: $('table tr.week'),
      static: {
        $calendarWrapper: $('.calendar-wrapper'),
        $viewSelect: $('#view-select')
      }
    };

    // History API popstate handling
    window.addEventListener('popstate', function(e) {
      console.log(e.state);
      switch(e.state.view) {
        case 'mo':
          if(e.state.month != _this.ctx.month) {
            var cacheKey = 'y' + e.state.year + 'm' + e.state.month;
            _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
            _this.update(e.state.year, e.state.month);
          }
          _this.showCalendarNavigation();
          break;
        case 'wk':
          // if different month, load calendar from cache
          if(e.state.month != _this.ctx.month) {
            var cacheKey = 'y' + e.state.year + 'm' + e.state.month;
            _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
            _this.update(e.state.year, e.state.month);
          }
          _this.showWeekNavigation(e.state.row);
          break;
        default:
          return;
      }
    });

    $('#next-el').on('click', function() {
      alert('test');
    });

    $('.nav-el').on('click', function(e) {
      var month = _this.ctx.month;
      var year = _this.ctx.year;
      var dir = $(this).data('dir');

      switch(_this.view) {
        case 'mo':
          if(dir === 'prev') {
            if(month == 1) {
              month = 12;
              year -= 1;
            }
            else {
              month -= 1;
            }
          }
          else {
            if(month == 12) {
              month = 1;
              year += 1;
            }
            else {
              month += 1;
            }
          }
          
          var cacheKey = 'y' + year + 'm' + month;
      
          // Cache hit
          if(_this.cache[cacheKey]) {
            console.log('cache hit!');
            _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
            _this.update(year, month);
            
            history.pushState({view: 'mo', month: month, year: year}, null, '/calendars/' + year + "/" + month);
          }
          else {
            _this.loadCalendar(year, month);
          }
          break;
        case 'wk':
          var currWeekIndex = $($('tr.week:visible')[0]).data('week-index');
          if(dir === 'prev') {
            var prevWeekIndex = currWeekIndex - 1;
            
            // Get previous month calendar
            if(prevWeekIndex < 0) {
              if(month == 1) {
                month = 12;
                year -= 1;
              }
              else {
                month -= 1;
              }

              var cacheKey = 'y' + year + 'm' + month;
              if(_this.cache[cacheKey]) {
                _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
                var row = $('tr.week').length - 1;
                _this.update(year, month);
                _this.ctx.$weekRows.hide();
                $(_this.ctx.$weekRows[row]).show();
                history.pushState({view: 'wk', row: row, month: month, year: year}, null, '/calendars/' + year + "/" + month);
              }
              else {
                _this.loadCalendar(year, month, function() {
                  var row = _this.ctx.$weekRows.length-1;
                  _this.ctx.$weekRows.hide();
                  $(_this.ctx.$weekRows[row]).show();
                });
              }
            } else {
              history.pushState({view: 'wk', row: prevWeekIndex, month: month, year: year }, null, null);
              _this.ctx.$weekRows.hide();
              $(_this.ctx.$weekRows[prevWeekIndex]).show();
            }
          } 
          else {
            var nextWeekIndex = currWeekIndex + 1;
            var rows = _this.ctx.$weekRows.length;
            // Go to next month
            if(nextWeekIndex > rows - 1) {
              if(month == 12) {
                month = 1;
                year += 1;
              }
              else {
                month += 1;
              }

              var cacheKey = 'y' + year + 'm' + month;
              if(_this.cache[cacheKey]) {
                _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
                var row = 0;
                _this.update(year, month);
                _this.ctx.$weekRows.hide();
                $(_this.ctx.$weekRows[row]).show();
                history.pushState({view: 'wk', row: row, month: month, year: year}, null, '/calendars/' + year + "/" + month);
              }
              else {
                
                _this.loadCalendar(year, month, function() {
                  var row = 0;
                  _this.ctx.$weekRows.hide();
                  $(_this.ctx.$weekRows[row]).show();
                });
              }
            } 
            else {
              history.pushState({view: 'wk', row: nextWeekIndex, month: month, year: year }, null, null);
              _this.ctx.$weekRows.hide();
              $(_this.ctx.$weekRows[nextWeekIndex]).show();
            }
          }
          break;
        case 'dy':
          break
      }
    });

    //*** BEGIN calendar navigation event handlers ***//
    $('a#next-week').on('click', function(e) {
      e.preventDefault();
      
      var currWeekIndex = $($('tr.week:visible')[0]).data('week-index');
      var nextWeekIndex = currWeekIndex + 1;

      _this.ctx.$weekRows.hide();
      $(_this.ctx.$weekRows[nextWeekIndex]).show();

      history.pushState({view: 'wk', row: nextWeekIndex, month: _this.ctx.month, year: _this.ctx.year }, null, null);
    });

    $('td').on('click', function(){
      window.location = $(this).data('show-path');
    });
    //*** END calendar navigation event handlers ***//

    // M select box
    _this.ctx.static.$viewSelect.select();
    _this.ctx.static.$viewSelect.on('change', function(e){
      var value = _this.ctx.static.$viewSelect.val();
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
    _this.cache[cacheKey] = _this.ctx.static.$calendarWrapper.html();
  },
  // Update context when new cal is loaded
  update: function(year, month) {
    this.refreshCtx(year, month);
    
    $('#month-name').text(monthNames[month-1]);
    $('#year').text(year);

    $('#next-year-link').attr('href', '/calendars/' + (year + 1) + '/' + month);
    $('#prev-year-link').attr('href', '/calendars/' + (year - 1) + '/' + month);
  },
  showCalendarNavigation: function() {
    this.setViewSelect(0);
    this.ctx.$weekRows.show();
  },
  showWeekNavigation: function(weekIndex=0) {
    this.setViewSelect(1);
    this.ctx.$weekRows.hide()
    $(this.ctx.$weekRows[weekIndex]).show();
  },
  // reset M select box
  setViewSelect: function(i) { 
    document.getElementById("view-select").selectedIndex = i;
    this.ctx.static.$viewSelect.select();
  },
  loadCalendar: function(year, month, cb=$.noop) {
    var _this = this;
    const cacheKey = 'y' + year + 'm' + month;
    
    $.ajax({
      url:  "/async_calendar/" + _this.ctx.year + "/" + _this.ctx.month,
      success: function(data) {
        _this.ctx.static.$calendarWrapper.html(data);
        
        if(!_this.cache[cacheKey]) {
          _this.cache[cacheKey] = data;
        }
        
        _this.update(year, month);
        
        history.pushState({view: _this.ctx.view, month: month, year: year}, null, '/calendars/' + year + "/" + month);
        cb();
      },
      dataType: 'html'
    });
  }
};