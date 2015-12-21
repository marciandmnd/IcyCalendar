class CalendarsController < ApplicationController
	# require 'active_support/core_ext/date_and_time/calculations.rb'
	def index
		@month = params[:year].to_i
		@next_month = @month == 12 ? 1 : @month + 1
		@prev_month =  @month == 1 ? 12 : @month - 1
		
		@year = params[:month].to_i
		@current_date = Time.new(@year,@month,1).to_date
		@calendar_cell_index = 0;
		@day_index = 1;
		@first_weekday_of_month = @current_date.wday 
		@num_weeks_in_month = (Time::days_in_month(05,2010).to_f / 7).ceil
		@num_days_in_month = Time::days_in_month(@current_date.month, @current_date.year)
	end

	def show_day

	end

	def demo
		session[:demo] = true;
		session[:expires_at] = Time.now + 60 #one minute
		#get number of demo users to format demo user email
		#@user = User.new(email: 'demouser@icycalendar.com', password: 'foobar', password_confirmation:'foobar')
		# @user = User.new({:email => "guy@gmail.com", :password => "111111", :password_confirmation => "111111" }).save(false)
		# @user = User.create!({:email => "guy@gmail.com", :password => "111111!!", :password_confirmation => "111111!!" })

		# # @user.save
		# session[:demo_user_id] = @user.id
		redirect_to calendar_path(Time.now.year,Time.now.month)
	end
end
