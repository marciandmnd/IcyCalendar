class AppointmentsController < ApplicationController

  def new
    @appointment = Appointment.new
    @user = current_user

    @day = params[:day].to_i
    @year = params[:year].to_i
    @month = params[:month].to_i

    @date = Date.new(@year,@month,@day)
  end

  def create
  	@appointment = current_user.appointments.build(appointment_params)

    appt_date = DateTime.strptime(params[:appointment][:date], "%Y-%m-%d")

    appt_year = appt_date.year
    appt_month = appt_date.month
    appt_day = appt_date.day

    date_from_hour = params[:appointment]["date_from(4i)"].to_i
    date_from_minute = params[:appointment]["date_from(5i)"].to_i
    date_from = DateTime.new(appt_year, appt_month, appt_day, date_from_hour, date_from_minute)

    date_to_hour = params[:appointment]["date_to(4i)"].to_i
    date_to_minute = params[:appointment]["date_to(5i)"].to_i
    date_to = DateTime.new(appt_year, appt_month, appt_day, date_from_hour, date_from_minute)
    
    @appointment.date_from = date_from
    @appointment.date_to = date_to
    @appointment.save

    redirect_to show_day_path(@appointment.date_from.year, @appointment.date_from.month, @appointment.date_from.day)
  end

  def edit
    @appointment = Appointment.find(params[:id])
    @day = params[:day]
    @year = params[:year].to_i
    @month = params[:month].to_i
    @date = Time.new(@year,@month,@day)
  end

  def update
    @appointment = Appointment.find(params[:id])
    @appointment.update(appointment_params)
    redirect_to show_day_path(@appointment.date_from.year, @appointment.date_from.month, @appointment.date_from.day)
  end

  def destroy
  	@appointment = Appointment.find(params[:id])
  	respond_to do |format|
	  	if @destroyed_record_id = @appointment.destroy.id
	  		format.js
	  	end
  	end
  end

  private

  def appointment_params
  	params.require(:appointment).permit(:description)
  end
end
