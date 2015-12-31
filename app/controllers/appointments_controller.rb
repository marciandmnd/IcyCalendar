class AppointmentsController < ApplicationController
  def new
    @appointment = Appointment.new
    @date = Date.new(params[:year].to_i, params[:month].to_i, params[:day].to_i)
    respond_to do |format|
        format.js
      end
  end

  def create
  	@appointment = Appointment.new(appointment_params)
  	@appointment.user_id = current_or_guest_user.id
  	respond_to do |format|
	  	if @appointment.save
	  		format.js
	  	else
			format.js {render :partial=> 'appointments/invalid.js'}
	  	end
  	end
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
