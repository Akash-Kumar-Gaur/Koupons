import firebase from 'firebase';
import { StoreEvent } from '../Common/Library/State-Manager/stateManager.utils';

export function GetCoupons(endpoint) {
    firebase.database().ref(`${endpoint}`).on('value', (data) => {
        let returnArr = [];
        data.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        StoreEvent({ eventName: 'coupons', data: returnArr });
        return returnArr;
    })
}