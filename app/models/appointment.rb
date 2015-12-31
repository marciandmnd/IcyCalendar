class Appointment < ActiveRecord::Base
	belongs_to :user
	validates_length_of :description, :minimum => 5, :allow_blank => false
end
