class AppointmentsController < ApplicationController
  
  def new
    @appointment = Appointment.new
    respond_to do |format|
        format.js
      end
  end

  def create
  	@appointment = Appointment.new(appointment_params)
  	@appointment.user_id = session[:guest_user_id]
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
  	params.require(:appointment).permit(:description, :date_time)
  end
end
