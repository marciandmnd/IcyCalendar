class Appointment < ActiveRecord::Base
	belongs_to :user
	validates_length_of :description, :allow_blank => false
end
