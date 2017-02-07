class AppointmentsController < ApplicationController

  def new
    @appointment = Appointment.new
    @user = current_user

    @day = params[:day]
    @year = params[:year].to_i
    @month = params[:month].to_i
    @date = Time.new(@year,@month,@day)
  end

  def create
  	@appointment = current_user.appointments.build(appointment_params)
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
  	params.require(:appointment).permit(:description, :date_from)
  end
end
