class PagesController < ApplicationController
  def index
  	@current_month = Time.now.month
  	@current_year = Time.now.year
  end
end
