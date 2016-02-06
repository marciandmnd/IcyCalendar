class RegistrationsController < Devise::RegistrationsController
  def new
    super
  end

  def create
    # add custom create logic here
    super
  end

  def update
    super
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :time_zone, :guest)
  end

  def account_update_params
    params.require(:user).permit(:email, :password, :password_confirmation, :current_password, :time_zone, :guest)
  end
end 