class CalendarsController < ApplicationController
	before_action :set_year_and_month, only: [:show, :async_calendar, :show_day]

	def show
		@next_month = @month == 12 ? 1 : @month + 1
		@prev_month =  @month == 1 ? 12 : @month - 1
		set_instance_variables
	end

	def async_calendar
		set_instance_variables
		respond_to do |format|
			format.js
    end
	end

	def show_day
		@day = params[:day]
		@date = Time.new(@year,@month,@day)
		@appointments = Appointment.where('extract(year from date_from) = ? AND extract(month from date_from) = ? AND extract(day from date_from) = ? AND user_id = ?', @year, @month, @day, current_user.id).order(:date_from)
	end
	
	private

	def set_year_and_month
		@year = params[:year].to_i
		@month = params[:month].to_i
	end

	def set_instance_variables
		@current_month = Time.new(@year, @month, 1).to_date
		@current_date = Time.new
		
		# For highlighting today
		if @current_date.month == @month && @current_date.year == @year
			@today = @current_date.day
		end

		@cell_index = 0;
		@day_index = 1;
		@first_weekday_of_month = @current_month.wday 
		@num_days_in_month = Time::days_in_month(@current_month.month, @current_month.year)
		
		@appointments = Appointment.where('extract(year from date_from) = ? AND extract(month from date_from) = ? AND user_id = ?', @year, @month, current_user.id)
		
		# Group appointments by day
		@appts = {}
		@appointments.each do |a|
			if @appts[a.date_from.day]
				@appts[a.date_from.day].push a
			else
				@appts[a.date_from.day] = [a]
			end
		end
	end
end
