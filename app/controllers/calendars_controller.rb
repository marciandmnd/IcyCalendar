class CalendarsController < ApplicationController
	before_action :set_year_and_month, only: [:index, :show, :show_day]
	def index
		#TODO write method to ensure only valid dates are provided in URL
		# @year < Time.now.year-100 ? (redirect_to calendar_path(Time.now.year-100, @month)) : nil
		# @year > Time.now.year+100 ? (redirect_to calendar_path(Time.now.year+100, @month)) : nil
		# @month < 1 ? (redirect_to calendar_path(@year, 1)) : nil
		# @month > 12 ? (redirect_to calendar_path(@year, 12)) : nil
    
		# @user = current_or_guest_user
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

		@appointments = Appointment.where('extract(year from date) = ? AND extract(month from date) = ? AND user_id = ?', @year, @month, current_or_guest_user.id)
		@appointments_indices = Hash[(0...@num_days_in_month).map { |num| [num,  0] }]

		@appointments.each do |appointment|
			@appointments_indices[appointment.date.day-1] += 1
		end

	end

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
	end

	def show_day
		@day = params[:day]
		@date = Time.new(@year,@month,@day)
		@appointments = Appointment.where('extract(year from date) = ? AND extract(month from date) = ? AND extract(day from date) = ? AND user_id = ?', @year, @month, @day, current_or_guest_user.id)
		@appointment = Appointment.new #for new appointment creation
	end
	
	private

	def set_year_and_month
		@year = params[:year].to_i
		@month = params[:month].to_i
	end
end
