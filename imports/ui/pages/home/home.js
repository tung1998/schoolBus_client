import './home.html';

import '../../components/shared/aside/aside.js'
import '../../components/shared/header/header.js'
import '../../components/shared/footer/footer.js'
import '../../components/shared/mobileHeader/mobileHeader.js'
import {
    _SESSION
} from '../../../variableConst';

Template.App_home.onCreated(() => {
    Session.set(_SESSION.isLoading, true)
});

Template.App_home.helpers({
    isLoading() {
        return Session.get(_SESSION.isLoading)
    }
});