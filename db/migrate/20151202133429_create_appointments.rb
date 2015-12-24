class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.date :date_time
      t.text :description

      t.timestamps null: false
    end
  end
end
