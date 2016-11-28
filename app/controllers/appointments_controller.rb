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
    redirect_to show_day_path(@appointment.time.year, @appointment.time.month, @appointment.time.day)
  end

  def edit
    @appointment = Appointment.find(params[:id])
    respond_to do |format|
      if @appointment
        format.js
      end
    end
  end

  def update
    @appointment = Appointment.find(params[:id])
    respond_to do |format|
      if @appointment.update(appointment_params)
        format.js
      end
    end
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
  	params.require(:appointment).permit(:description, :time, :date)
  end
end
