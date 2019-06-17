import React, { Component } from 'react';
import { View, Picker, TextInput, ScrollView } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export default class PostCoupons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            category: '',
            loading: false,
            name: '',
            code: '',
            details: '',
            tnc: '',
            category: 'food'
        }
    }

    postCouponToFirebase = () => {
        this.setState({ loading: true });
        const { name, code, details, tnc, category } = this.state;
        firebase.database().ref('coupons').push(
            {
                approved: 0,
                code: code,
                description: details,
                isCoupon: true,
                name: name,
                thumbnail: "http://i64.tinypic.com/20gy5g3.png",
                tnC: tnc,
                website: "https://www.swiggy.com/",
                backgroundColor: '#8D99AE',
                worked: 4,
                expired: 0,
                category: category
            }
        ).then(() => {
            this.setState({ loading: false });
            Actions.HOME();
        }).catch((error) => {
            console.log('error', error);
            this.setState({ loading: false });
        })
    }

    render() {
        const { loading } = this.state;
        return (
            <View style={{ paddingLeft: 10, paddingRight: 10, flex: 1, backgroundColor: 'transparent', zIndex: 100, marginTop: 80 }}>
                <Text style={{ marginLeft: 5, fontSize: 22, color: '#000' }}>Got any coupons? Post it here and help others too.</Text>

                <Text style={{ marginLeft: 5, marginTop: 25, fontSize: 16, color: '#000' }}>Coupons are reviewed and tested before going live on app. Please wait for the review after posting your coupons</Text>

                <ScrollView style={{ marginTop: 50, margin: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                            <Text>Coupon Name</Text>
                            <TextInput
                                allowFontScaling={false}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor={'#ced1db'}
                                placeholder='ex. Drivezy/Zomato'
                                autoComplete='off'
                                onChangeText={(name) => this.setState({ name })}
                                autoCorrect={false}
                                style={{ marginLeft: -5 }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text>Coupon Code</Text>
                            <TextInput
                                allowFontScaling={false}
                                underlineColorAndroid={'transparent'}
                                placeholderTextColor={'#ced1db'}
                                placeholder='ex. ABCD-EF100'
                                autoComplete='off'
                                onChangeText={(code) => this.setState({ code })}
                                autoCorrect={false}
                                style={{ marginLeft: -5 }}
                            />
                        </View>
                    </View>

                    <Text style={{ marginTop: 10 }}>Coupon Details</Text>
                    <TextInput
                        allowFontScaling={false}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#ced1db'}
                        placeholder='ex. Flat 50% off'
                        onChangeText={(details) => this.setState({ details })}
                        autoComplete='off'
                        autoCorrect={false}
                        style={{ marginLeft: -5 }}
                    />

                    <Text style={{ marginTop: 10 }}>TnCs (If any)</Text>
                    <TextInput
                        allowFontScaling={false}
                        underlineColorAndroid={'transparent'}
                        placeholderTextColor={'#ced1db'}
                        placeholder='ex. For new users'
                        onChangeText={(tnc) => this.setState({ tnc })}
                        autoComplete='off'
                        autoCorrect={false}
                        style={{ marginLeft: -5 }}
                    />

                    <Text style={{ marginTop: 10 }}>Coupon Category</Text>
                    <Picker
                        selectedValue={this.state.category}
                        style={{ height: 50, width: 400 }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ category: itemValue })
                        }>
                        <Picker.Item label="Food/Beverages" value="food" />
                        <Picker.Item label="Travel" value="travel" />
                        <Picker.Item label="Shopping" value="shopping" />
                        <Picker.Item label="Others" value="other" />
                    </Picker>

                    <View style={{ position: 'relative', marginTop: 50, backgroundColor: 'red' }}>
                        <Button
                            title='Submit'
                            loading={loading}
                            onPress={() => this.postCouponToFirebase()}
                        />
                    </View>
                </ScrollView>

            </View>
        );
    }
}