class RenameDatetimeAppointments < ActiveRecord::Migration
  def change
  	rename_column :appointments, :date_time, :date
  end
end
