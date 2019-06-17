import React, { Component } from 'react';
import { View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { CouponIcon, Koupons } from '../../Config/imageMap';
import { Text } from 'react-native-elements';

export default class SplashScreen extends React.Component {
    render() {

        return (
            <Animatable.View animation="pulse" iterationCount={10} style={{ backgroundColor: '#fff', flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={CouponIcon()} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
                {/* <Text style={{ marginTop: 20, fontSize: 45, color: '#000' }}>Koupons</Text> */}
                <Image source={Koupons()} style={{ width: 180, height: 100, resizeMode: 'contain' }} />
                {/* <Text style={{ marginTop: 10, fontSize: 20 }}>Deals and More...</Text> */}
            </Animatable.View>
        );
    }
}