import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import firebase from 'firebase';

import { Scene, Router, Reducer, Stack, Actions } from 'react-native-router-flux';
import SideNav from '../Components/Home-Component/Sidenav-Component/sideNav.component';
import { DrawerIcon } from '../Config/imageMap';
import HomeScene from '../Scenes/Home-Scene/home.scene';
import HomeNavbar from '../Components/Home-Component/Home-Navbar/homeNavbar.component';
import SplashScreen from '../Scenes/Splash-Screen/splashScreen.scene';
import { GetCoupons } from '../Apis/privateApis';
import { CouponsEndpoint } from '../Constants/api.constants';
import PostCoupons from '../Scenes/Post-Coupon-Scene/postCoupon.scene';

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => defaultReducer(state, action);
};

const getSceneStyle = () => ({
    backgroundColor: '#fff',
    shadowOpacity: 1,
    shadowRadius: 3
});

class AppNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        const firebaseConfig = {
            apiKey: "<Your API Key>",
            authDomain: "<Your Project Link>",
            databaseURL: "<Your Database Link>",
            projectId: "<Your Project ID>",
            storageBucket: "<Your link>",
            messagingSenderId: "<Sender ID>",
            appId: "<Your app ID>"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        GetCoupons(CouponsEndpoint);
    }

    async componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 2000);
    }

    handleAndroidBack = () => {
        if (Actions.currentScene != 'HOME') {
            Actions.pop();
            return true;
        }
    };

    notification() {
        return (
            <CustomView style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <CustomTouchableOpacity onPress={() => Actions.NOTIFICATION_SCENE()}>
                    <CustomImage
                        source={NotificationIcon()}
                        style={{ width: 18, height: 18, resizeMode: 'contain', marginRight: 10 }}
                    />
                </CustomTouchableOpacity>
            </CustomView>
        );
    }

    render() {
        const { loading } = this.state;
        return (
            loading ?
                <SplashScreen />
                :
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }
                }>
                    <Router
                        createReducer={reducerCreate}
                        getSceneStyle={getSceneStyle}
                        backAndroidHandler={() => this.handleAndroidBack()}
                    >
                        {/* <Drawer
                            key="drawer"
                            contentComponent={SideNav}
                            drawerImage={DrawerIcon}
                            drawerWidth={300}
                        > */}
                        <Stack key="Stack">
                            <Scene
                                key="HOME"
                                initial
                                headerMode="screen"
                                navBar={HomeNavbar}
                                component={HomeScene}
                            />

                            <Scene
                                key="POST_COUPONS"
                                // initial
                                headerMode="screen"
                                navBar={HomeNavbar}
                                component={PostCoupons}
                            />



                        </Stack>
                        {/* </Drawer> */}
                    </Router>

                </SafeAreaView>
        );
    }
}

export default AppNavigator;
