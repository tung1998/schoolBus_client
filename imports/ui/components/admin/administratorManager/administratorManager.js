import './administratorManager.html'

Template.editAdministratorModal.events({
    'submit form' (event) {
        event.preventDefault();
        const target = event.target;
        let admin = {
            name: target.name.value,
            dob: target.dob.value,
            address: target.address.value,
            phoneNumber: target.phoneNumber.value,
            email: target.email.value,
            adminType: target.adminType.value,
            //avatar: target.adminType

        }
        let accessToken = Cookies.get('accessToken')
        console.log(accessToken)
        console.log(admin)
    }
})