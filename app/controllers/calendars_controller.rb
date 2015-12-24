class CalendarsController < ApplicationController
	before_action :set_year_and_month, only: [:index, :show_day]
	def index
		#TODO write method to ensure only valid dates are provided in URL
		# @year < Time.now.year-100 ? (redirect_to calendar_path(Time.now.year-100, @month)) : nil
		# @year > Time.now.year+100 ? (redirect_to calendar_path(Time.now.year+100, @month)) : nil
		# @month < 1 ? (redirect_to calendar_path(@year, 1)) : nil
		# @month > 12 ? (redirect_to calendar_path(@year, 12)) : nil

		@next_month = @month == 12 ? 1 : @month + 1
		@prev_month =  @month == 1 ? 12 : @month - 1

		@current_month = Time.new(@year,@month,1).to_date
		@current_date = Time.new

		@current_date.month == @month ? @today = @current_date.day : @today = nil

		@calendar_cell_index = 0;
		@day_index = 1;
		@first_weekday_of_month = @current_month.wday 
		@num_weeks_in_month = (@num_days_in_month.to_f / 7).ceil
		@num_days_in_month = Time::days_in_month(@current_month.month, @current_month.year)

		@appointments = Appointment.where('extract(year from date_time) = ? AND extract(month from date_time) = ? AND user_id = ?', @year, @month,session[:guest_user_id])
		@appointments_indices = Hash[(0...@num_days_in_month).map { |num| [num,  0] }]

		@appointments.each do |appointment|
			@appointments_indices[appointment.date_time.day-1] += 1
		end

	end

	def show_day
		@day = params[:day]
		@date = Time.new(@year,@month,@day)
		@appointments = Appointment.where('extract(year from date_time) = ? AND extract(month from date_time) = ? AND extract(day from date_time) = ? AND user_id = ?', @year, @month, @day, session[:guest_user_id])
		@appointment = Appointment.new #for new appointment creation
	end

	def demo
		if current_or_guest_user != guest_user
			create_guest_user #unless session[:guest_user_id]
		end
		session[:demo] = true;
		redirect_to calendar_path(Time.now.year,Time.now.month)
	end

	private

	def set_year_and_month
		@year = params[:year].to_i
		@month = params[:month].to_i
	end
end
