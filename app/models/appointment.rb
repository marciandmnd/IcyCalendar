class Appointment < ActiveRecord::Base
	validates_length_of :description, :minimum => 5, :allow_blank => false
end
