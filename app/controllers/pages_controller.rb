class PagesController < ApplicationController
  def index
  	if user_signed_in?
  		redirect_to calendar_path(Time.now.year, Time.now.month)
  	end
  end

  def about
  end
end
