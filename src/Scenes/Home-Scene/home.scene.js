import React, { Component } from 'react';
import { View, FlatList, Image, TouchableOpacity, ScrollView, Clipboard, StyleSheet, TextInput } from 'react-native';
import { Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { robotoWeights } from 'react-native-typography';
import firebase from 'firebase';

import { SubscribeToEvent } from '../../Common/Library/State-Manager/stateManager.utils';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import FacebookTabBar from './facebookTabBar';

export default class HomeScene extends Component {

    constructor(props) {
        super(props);

        this.state = {
            couponsArray: [],
            searched: false
        }
    }

    componentDidMount() {
        // firebase.database().ref(`${CouponsEndpoint}`).push(
        //     {
        //         approved: 1,
        // code: "AKAS8166S",
        // description: "Get ₹200 off on Zomato Gold Membership",
        // isCoupon: true,
        // key: "-LhS7np_BL-D0RZiluHf",
        // name: "Zomato",
        // thumbnail: "http://i68.tinypic.com/2i07q60.png",
        // tnC: "Coupon aplicable 12 month Zomato Gold Membership",
        // website: "https://www.zomato.com/",
        //     }
        // ).then(() => {
        //     console.log('Inserted');
        // }).catch((error) => {
        //     console.log('error', error);
        // })
        // firebase.database().ref('coupons').push(
        //     {
        //         approved: 1,
        //         code: "Y5SWXO",
        //         description: "Get ₹100 off on order above ₹199",
        //         isCoupon: true,
        //         name: "Swiggy",
        //         thumbnail: "http://i64.tinypic.com/io22e1.png",
        //         tnC: "Coupon aplicable on first order only",
        //         website: "https://www.swiggy.com/",
        //         backgroundColor: '#20A39E',
        //         worked: 4,
        //         expired: 0
        //     }
        // ).then(() => {
        //     console.log('Inserted');
        // }).catch((error) => {
        //     console.log('error', error);
        // })
        SubscribeToEvent({ eventName: 'coupons', callback: this.couponsData });
    }

    couponsData = (data) => {
        this.setState({ couponsArray: data });
        this.createFilteredCards(data);
    }

    createFilteredCards = (data) => {
        const all = [];
        const shopping = [];
        const travel = [];
        const food = [];
        const others = [];
        console.log('data', data);

        data.map((entry) => {
            switch (entry.category) {
                case 'food': food.push(entry); all.push(entry); break;
                case 'travel': travel.push(entry); all.push(entry); break;
                case 'shopping': shopping.push(entry); all.push(entry); break;
                case 'other': others.push(entry); all.push(entry); break;
            }
        });
        this.setState({ all, shopping, travel, food, others });
    }

    writeToClipboard = async (card) => {
        //To copy the text to clipboard
        await Clipboard.setString(card.code);
        card.copied = true;
        this.setState({ card, couponsArray });
        setTimeout(() => {
            card.copied = false;
            this.setState({ card, couponsArray });
        }, 2000);
        // alert(`Code ${text} Copied to Clipboard!`);
    };

    renderCouponCard = (card) => {
        // console.log('card', card);
        // '#161616'
        return (
            card.approved ?
                <Animatable.View animation="bounceInUp" duration={1500} style={{ backgroundColor: card.backgroundColor, marginBottom: 30, padding: 20, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Image source={{ uri: card.thumbnail }} style={{ resizeMode: 'contain', width: 100, height: 80 }} />

                        <View style={{ paddingTop: 10, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => { card.copied = true; this.writeToClipboard(card); this.setState(card) }}
                                style={{
                                    borderWidth: 2,
                                    borderRadius: 8,
                                    borderStyle: 'dashed',
                                    borderColor: card.textColor ? card.textColor : '#D1D2DE',
                                    padding: 10
                                }}>
                                <Text style={[robotoWeights.light, { color: card.textColor ? card.textColor : '#fff' }]}>{card.code}</Text>
                            </TouchableOpacity>

                            <Text style={{ color: card.textColor ? card.textColor : '#fff', fontSize: 12 }}>
                                {card.copied ? 'Copied' : 'Click to Copy'}
                            </Text>

                        </View>
                    </View>
                    <Text style={[robotoWeights.condensedBold, { color: card.textColor ? card.textColor : '#fff', fontSize: 26 }]}>{card.name}</Text>
                    <Text style={[robotoWeights.light, { color: card.textColor ? card.textColor : '#fff', marginTop: 25, fontSize: 18 }]}>{card.description}</Text>
                    <Text style={[robotoWeights.light, { color: card.textColor ? card.textColor : '#fff', marginTop: 35, fontSize: 12, paddingBottom: 10 }]}>{card.tnC}</Text>
                </Animatable.View >
                : null
        )
    }

    filterCoupons = (searchText) => {
        const { all, couponsArray } = this.state;
        if (searchText.length) {
            let filteredCoupons = [];
            all.map((entry) => {
                if ((entry.name.toLowerCase()).includes(searchText.toLowerCase())) {
                    filteredCoupons.push(entry);
                }
            })
            // if (filteredCoupons.length) {
            //     this.setState({ all: filteredCoupons });
            // } else {
            //     this.setState({ all: couponsArray });
            // }
            this.setState({ all: filteredCoupons, searched: true });
        } else {
            this.setState({ all: couponsArray });
        }
    }

    render() {
        const { couponsArray, all, travel, food, shopping, others, searched } = this.state;

        return (
            <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1, backgroundColor: 'transparent', zIndex: 100, marginTop: 60 }}>
                {/* <FlatList
                    style={{ paddingTop: 20 }}
                    initialListSize={2}
                    data={couponsArray}
                    renderItem={({ item }) => this.renderCouponCard(item)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index}
                /> */}
                <View style={{ margin: 5, marginBottom: 5 }}>
                    <TextInput
                        allowFontScaling={false}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#888'}
                        placeholder='Search your coupons'
                        onChangeText={(searchText) => this.filterCoupons(searchText)}
                        autoComplete='off'
                        autoCorrect={false}
                        style={{ borderWidth: 1, borderRadius: 10, padding: 10, margin: 10 }}
                    />
                </View>
                <ScrollableTabView
                    initialPage={0}
                    tabBarPosition={'bottom'}
                    renderTabBar={() => <FacebookTabBar />}
                >
                    <ScrollView tabLabel="ios-list" style={styles.tabView} name='All'>
                        {
                            all && all.length ?
                                <FlatList
                                    // style={{ paddingTop: 20 }}
                                    initialListSize={2}
                                    data={all}
                                    renderItem={({ item }) => this.renderCouponCard(item)}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>{searched ? 'Oh no! We are out of Koupons' : 'Please wait while we fetch Koupons for you'}</Text>
                                </View>
                        }
                    </ScrollView>
                    <ScrollView tabLabel="ios-shirt" style={styles.tabView}>
                        {
                            shopping && shopping.length ?
                                <FlatList
                                    // style={{ paddingTop: 20 }}
                                    initialListSize={2}
                                    data={shopping}
                                    renderItem={({ item }) => this.renderCouponCard(item)}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>No Koupons in this category</Text>
                                </View>
                        }
                    </ScrollView>
                    <ScrollView tabLabel="logo-model-s" style={styles.tabView}>
                        {
                            travel && travel.length ?
                                <FlatList
                                    // style={{ paddingTop: 20 }}
                                    initialListSize={2}
                                    data={travel}
                                    renderItem={({ item }) => this.renderCouponCard(item)}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>No Koupons in this category</Text>
                                </View>
                        }

                    </ScrollView>
                    <ScrollView tabLabel="ios-pizza" style={styles.tabView}>
                        {
                            food && food.length ?
                                <FlatList
                                    // style={{ paddingTop: 20 }}
                                    initialListSize={2}
                                    data={food}
                                    renderItem={({ item }) => this.renderCouponCard(item)}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>No Koupons in this category</Text>
                                </View>
                        }

                    </ScrollView>
                    <ScrollView tabLabel="ios-pricetags" style={styles.tabView}>
                        {
                            others && others.length ?
                                <FlatList
                                    // style={{ paddingTop: 20 }}
                                    initialListSize={2}
                                    data={others}
                                    renderItem={({ item }) => this.renderCouponCard(item)}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index}
                                />
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>No Koupons in this category</Text>
                                </View>
                        }

                    </ScrollView>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 10,
        //   backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        //   borderWidth: 1,
        backgroundColor: '#fff',
        //   borderColor: 'rgba(0,0,0,0.1)',
        //   margin: 5,
        //   height: 150,
        //   padding: 15,
        //   shadowColor: '#ccc',
        //   shadowOffset: { width: 2, height: 2, },
        //   shadowOpacity: 0.5,
        //   shadowRadius: 3,
    }
});