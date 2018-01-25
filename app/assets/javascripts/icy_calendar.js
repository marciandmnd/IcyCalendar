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
        $viewSelect: $('#view-select'),
        $monthSelect: $('#month-select'),
        $yearSelect: $('#year-select')
      },
    };

    // History API popstate handling
    window.addEventListener('popstate', function(e) {
      console.log(e.state);
      switch(e.state.view) {
        case 'mo':
          if(e.state.month != _this.ctx.month || e.state.year != _this.ctx.year) {
            var cacheKey = 'y' + e.state.year + 'm' + e.state.month;
            _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
            _this.update(e.state.year, e.state.month);
          }
          _this.showCalendarNavigation();
          break;
        case 'wk':
          // if different month, load calendar from cache
          if(e.state.month != _this.ctx.month || e.state.year != _this.ctx.year) {
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

    //*** BEGIN Navigate by week or month (TODO: day)
    $('.nav-el').on('click', function(e) {
      e.preventDefault();
      console.log('click');
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
          console.log(cacheKey);
          // console.log(_this.cache[cacheKey]);

          // Cache hit
          if(_this.cache[cacheKey]) {
            console.log('cache hit!!');
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
    //*** END Navigate by week or month (TODO: day)
    
    //*** BEGIN Navigate by year (TODO: day)
    $('.nav-el-year').on('click', function() {
      var dir = $(this).data('dir');
      if(dir === 'prev') {
        var year = _this.ctx.year - 1;
        if(_this.view == 'mo') {
          history.pushState({view: _this.view, month: _this.ctx.month, year: year }, null, '/calendars/' + year + "/" +  _this.ctx.month);
        }
        else {
          var row = $('tr.week:visible').data('week-index') + 1;
          history.pushState({view: _this.view, row: row, month: _this.ctx.month, year: year }, null, '/calendars/' + year + "/" +  _this.ctx.month);
        }
        _this.loadCalendar(year, _this.ctx.month);
      }
      else {
        var year = _this.ctx.year + 1;
        if(_this.view == 'mo') {
          history.pushState({view: _this.view, month: _this.ctx.month, year: year }, null, '/calendars/' + year + "/" +  _this.ctx.month);
        }
        else {
          var row = $('tr.week:visible').data('week-index') + 1;
          history.pushState({view: _this.view, row: row, month: _this.ctx.month, year: year }, null, '/calendars/' + year + "/" +  _this.ctx.month);
        }
        _this.loadCalendar(year, _this.ctx.month);
      }
    });
    
    $('td').on('click', function(){
      window.location = $(this).data('show-path');
    });
    //*** END calendar navigation event handlers ***//

    // M month select box
    document.getElementById("month-select").selectedIndex = _this.ctx.month - 1;
    _this.ctx.static.$monthSelect.select();
    _this.ctx.static.$monthSelect.on('change', function(e) {
      var month = _this.ctx.static.$monthSelect.val();
      _this.loadCalendar(_this.ctx.year, month);
    });

    // M year select box
    document.getElementById("year-select").selectedIndex = $($('#y' + _this.ctx.year)).prevAll().length;
    _this.ctx.static.$yearSelect.select();
    _this.ctx.static.$yearSelect.on('change', function(e) {
      var year = _this.ctx.static.$yearSelect.val();
      history.pushState({view: _this.view, month: _this.ctx.month, year: year}, null, '/calendars/' + year + "/" + _this.ctx.month);
      _this.loadCalendar(year, _this.ctx.month);
    });

    // M view select box
    document.getElementById("view-select").selectedIndex = 0;
    _this.ctx.static.$viewSelect.select();
    _this.ctx.static.$viewSelect.on('change', function(e){
      var value = _this.ctx.static.$viewSelect.val();
      switch(value) {
        case 'month':
          if(_this.view === 'mo') break;
          _this.showCalendarNavigation();
          history.pushState({view: 'mo', month: _this.ctx.month, year: _this.ctx.year }, null, null);
          break;
        case 'week':
          if(_this.view === 'wk') break;
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
    
    document.getElementById("month-select").selectedIndex = month - 1;
    this.ctx.static.$monthSelect.select();

    document.getElementById("year-select").selectedIndex = $($('#y' + this.ctx.year)).prevAll().length;
    this.ctx.static.$yearSelect.select();

    $('#month-name').text(monthNames[month-1]);
    $('#year').text(year);
  },
  showCalendarNavigation: function() {
    this.view = 'mo';
    this.setViewSelect(0);
    this.ctx.$weekRows.show();
    
    $('#time').removeClass('open');
    setTimeout(function() {
      $('#time').css('top', '0px');
    }, 750);
    setTimeout(function() {
      $('#calendar').removeClass('time-open')
    }, 200);
    
  },
  showWeekNavigation: function(weekIndex=0) {
    var _this = this;

    _this.setViewSelect(1);
    _this.ctx.$weekRows.hide()
    $(_this.ctx.$weekRows[weekIndex]).show();
    
    if(_this.view !== 'wk') {
      _this.view = 'wk';
      setTimeout(function(){
        // Position time timeline
        var tdOffset = $(_this.ctx.$weekRows[weekIndex]).find(">:first-child").offset().top;
        var timeOffset = $('#time').offset().top;
        var offset = tdOffset - timeOffset;
        $('#time').css('top', offset);
        $('#calendar').addClass('time-open');
        $('#time').addClass('open');
      }, 100)
    }
  },
  // reset M select box
  setViewSelect: function(i) { 
    document.getElementById("view-select").selectedIndex = i;
    this.ctx.static.$viewSelect.select();
  },
  loadCalendar: function(year, month, cb=$.noop) {
    var _this = this;
    const cacheKey = 'y' + year + 'm' + month;
    
    if(_this.cache[cacheKey]){
      console.log('[loadCalendar] cache hit!')
      _this.ctx.static.$calendarWrapper.html(_this.cache[cacheKey]);
      _this.update(year, month);
    }
    else {
      $.ajax({
        url:  "/async_calendar/" + year + "/" + month,
        success: function(data) {
          _this.ctx.static.$calendarWrapper.html(data);
          
          if(!_this.cache[cacheKey]) {
            _this.cache[cacheKey] = data;
          }
          
          _this.update(year, month);
          
          cb();
        },
        dataType: 'html'
      });
    }
  }
};