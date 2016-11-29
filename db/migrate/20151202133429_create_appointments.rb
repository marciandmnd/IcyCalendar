class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.datetime :date_from
      t.datetime :date_to
      t.text :description

      t.timestamps null: false
    end
  end
end
