import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Image, Platform, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Header } from 'react-native-elements';

import { SmoothNavigation } from '../../../Utils/common.utils';
import { DrawerIcon, Koupons } from '../../../Config/imageMap';

const { height } = Dimensions.get('window');

export default class HomeNavbar extends Component {

    renderLeftButton = () => {
        return (
            <TouchableHighlight
                onPress={() => SmoothNavigation(() => Actions.drawerOpen())}
                style={[styles.navBarItem, { backgroundColor: 'white' }]}
                underlayColor={'#fff'}
            >
                <View
                    style={[styles.navBarItem, { paddingLeft: 15, backgroundColor: '#fff' }]}
                >
                    {/* <CustomView style={{ position: 'absolute', width: (IsIphonex()) ? 60 : 50, height: 34, backgroundColor: GLOBAL.COLORS.GREEN, borderTopRightRadius: GetRelativeSizeHeight(20), borderBottomRightRadius: GetRelativeSizeHeight(20) }} /> */}
                    <Image
                        style={{ width: 18, height: 20, resizeMode: 'contain' }}
                        source={DrawerIcon()}
                    />
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLeftButton()} */}
                <Image source={Koupons()} style={{ width: 120, height: 60, resizeMode: 'contain' }} />
                <TouchableOpacity onPress={() => Actions.POST_COUPONS()} style={{ padding: 10, borderWidth: 1, margin: 10, borderColor: '#4a4a4a', height: 40, borderRadius: 15 }}>
                    <Text style={{ color: '#000' }}>+ Post Coupons</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? ((height == 812) ? 110 : 65) : 250,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderBottomWidth: 1,
        // borderBottomColor: '#4a4a4a50',
        paddingBottom: 10,
        paddingLeft: 10,
        position: 'absolute',
        top: 0,
        backgroundColor: '#ffe103',
        width: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    navBarItem: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    leftNavBarItem: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#41b6ac'
    },
    navBarItemDropdown: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
    }
});