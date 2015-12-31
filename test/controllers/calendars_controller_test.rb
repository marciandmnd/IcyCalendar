require 'test_helper'

class CalendarsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get show day" do
  	get :show_day
  	assert_response :success
  end

end
