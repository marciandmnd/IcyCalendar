class AddUserToAppointments < ActiveRecord::Migration
  def change
  	add_reference :appointments, :user, index: true 
  end
end
