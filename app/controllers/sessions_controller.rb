class SessionsController < Devise::SessionsController

  def new
    super
  end

  def create
    if session[:guest_user_id]
      puts "!!!!!!!!guest user id in session"
      session.delete(:guest_user_id)
      if session[:guest_user_id] == nil
        puts "session variable deleted succesfully************8"
      end
    end
   super
  end

end