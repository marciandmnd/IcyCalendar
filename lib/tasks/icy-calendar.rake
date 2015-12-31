namespace :icycalendar do
  task delete_guest_data: :environment do
    User.where('guest=true').destroy_all
  end
end