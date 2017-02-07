class CalendarsController < ApplicationController
	before_action :set_year_and_month, only: [:index, :show, :show_day]

	def show
		@next_month = @month == 12 ? 1 : @month + 1
		@prev_month =  @month == 1 ? 12 : @month - 1

		@current_month = Time.new(@year, @month,1).to_date
		@current_date = Time.new
		@current_date.month == @month && @current_date.year == @year ? @today = @current_date.day : nil

		@calendar_cell_index = 0;
		@day_index = 1;
		@first_weekday_of_month = @current_month.wday 
		@num_weeks_in_month = (@num_days_in_month.to_f / 7).ceil
		@num_days_in_month = Time::days_in_month(@current_month.month, @current_month.year)

		@appointments = Appointment.where('extract(year from date_from) = ? AND extract(month from date_from) = ? AND user_id = ?', @year, @month, current_user.id)
		@appts = @appointments.map {|a| [a.date_from.day, a] }.to_h
	end

	def show_day
		@day = params[:day]
		@date = Time.new(@year,@month,@day)
		@user = current_user
		@appointment = Appointment.new

		@appointments = Appointment.where('extract(year from date_from) = ? AND extract(month from date_from) = ? AND extract(day from date_from) = ? AND user_id = ?', @year, @month, @day, current_user.id)
	end
	
	private

	def set_year_and_month
		@year = params[:year].to_i
		@month = params[:month].to_i
	end
end
