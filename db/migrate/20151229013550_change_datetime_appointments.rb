class ChangeDatetimeAppointments < ActiveRecord::Migration
  def change
  	change_column :appointments, :date_time, :date
  end
end
