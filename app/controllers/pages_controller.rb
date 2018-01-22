class PagesController < ApplicationController
  def index
    # @user = current_or_guest_user
  	if user_signed_in?
  		redirect_to calendar_path(Time.now.year, Time.now.month)
  	end
  end

  def about
  end

  def settings
    @user = current_user
  end

  def help
  end
end
