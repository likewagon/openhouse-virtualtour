import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import normalize from "react-native-normalize";
import GetLocation from 'react-native-get-location';
import auth from '@react-native-firebase/auth'
import { postLoginInfo } from '../../api/rest';

import { Colors, Images, LoginInfo } from '@constants';
import {
  Button,
  Header,
} from '@components';

export default class FormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: LoginInfo.fullname,
      email: LoginInfo.email,
      telephone: LoginInfo.telephone,
      confirmResult: null,
      verificationCode: '',
    }
  }

  componentDidMount() {

  }

  handleSendCode = () => {
    // Request to send OTP
    if (this.validatePhoneNumber()) {
        auth()
        .signInWithPhoneNumber(this.state.telephone)
        .then(confirmResult => {
          this.setState({ confirmResult })
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Invalid Phone Number')
    }
  }

  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    return regexp.test(this.state.telephone)
  }

  handleVerifyCode = () => {
    // Request for OTP verification
    const { confirmResult, verificationCode } = this.state
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then(user => {
          this.setState({ userId: user.uid })
          alert(`Verified! ${user.uid}`)
          this.onOK();
        })
        .catch(error => {
          alert(error.message)
          console.log(error)
        })
    } else {
      alert('Please enter a 6 digit OTP code.')
    }

  }

  onOK = () => {    
    if (this.state.fullname == null || this.state.fullname == '') {
      Alert.alert('Please enter your full name');
      return;
    }
    if (this.state.email == null || this.state.email == '') {
      Alert.alert('Please enter your email address');
      return;
    }
    if (this.state.telephone == null || this.state.telephone == '') {
      Alert.alert('Please enter your phone number');
      return;
    }

    if (this.validatePhoneNumber()) {
      LoginInfo.fullname = this.state.fullname;
      LoginInfo.email = this.state.email;
      LoginInfo.telephone = this.state.telephone;

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          //console.log(location);
          LoginInfo.latitude = location.latitude;
          LoginInfo.longitude = location.longitude;
        })
        .catch(error => {
          console.log('get location error', error)
          Alert.alert('Cannot get your location'); 
        })
        
        this.submit()
    }
    else {
      alert('Invalid Phone Number')
    }
    
  }

  submit = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append('action', 'newaccount');
    bodyFormData.append('uniqueid', LoginInfo.uniqueid); 
    bodyFormData.append('fullname', LoginInfo.fullname); 
    bodyFormData.append('email', LoginInfo.email); 
    bodyFormData.append('telephone', LoginInfo.telephone); 
    bodyFormData.append('photourl', LoginInfo.photourl); 
    bodyFormData.append('providerid', LoginInfo.providerid);
    bodyFormData.append('email_verified', LoginInfo.email_verified);
    bodyFormData.append('latitude', LoginInfo.latitude);
    bodyFormData.append('longitude', LoginInfo.longitude); 
    bodyFormData.append('appid', 'com.openhousemarketingsystem.open');
    bodyFormData.append('referredby', 0);
        
    await postLoginInfo(bodyFormData)
      .then((res) => console.log('post login info success', res))
      .catch((err) => console.log('post login info error', err))

    this.props.navigation.navigate('Welcome');
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}>
        <ImageBackground style={styles.container} source={Images.splashBackground}>
          <View style={styles.overlay} />
          <View style={{ width: '100%' }}>
            <Header title='YOUR INFORMATION' titleColor={Colors.whiteColor} onPressBack={() => this.props.navigation.goBack(null)} />
          </View>
          <View style={styles.body}>
            <View style={styles.txtLabelContainer}>
              <Text style={styles.txtLabel}>Enter your information and we will send you an activation confirmation code.</Text>
            </View>

            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.txtInput}
                autoFocus={true}
                value={this.state.fullname}
                placeholder='Full name'
                placeholderTextColor={Colors.weakBlackColor}
                editable={LoginInfo.fullname ? false : true}
                onChangeText={(text) => this.setState({ fullname: text })}
              />
            </View>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.txtInput}
                autoFocus={true}
                value={this.state.email}
                placeholder='E-mail'
                placeholderTextColor={Colors.weakBlackColor}
                editable={LoginInfo.email ? false : true}
                onChangeText={(text) => this.setState({ email: text })}
              />
            </View>
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.txtInput}
                autoFocus={true}
                keyboardType={'numeric'}
                value={this.state.telephone}
                placeholder='Cell Phone Number'
                placeholderTextColor={Colors.weakBlackColor}
                editable={LoginInfo.telephone ? false : true}
                onChangeText={(telephone) => this.setState({ telephone })}                
              />
            </View>
            <View style={styles.nextContainer}>
              <Button btnTxt='Send' 
                btnStyle={{ width: '100%', height: normalize(50, 'height'), color: 'blue' }} 
                onPress={this.handleSendCode} />
            </View>
            { this.state.confirmResult &&
            <View style={styles.inputBoxContainer}>
              <TextInput
                style={styles.txtInput}
                autoFocus={true}
                keyboardType={'numeric'}
                value={this.state.verificationCode}
                placeholder='Verification Code'
                placeholderTextColor={Colors.weakBlackColor}
                editable={LoginInfo.telephone ? false : true}
                onChangeText={(verificationCode) => this.setState({ verificationCode })}
              />
            </View>
            }
            { this.state.confirmResult &&

              <View style={styles.nextContainer}>
                <Button btnTxt='Confirm' 
                  btnStyle={{ width: '100%', height: normalize(50, 'height'), color: 'blue' }} 
                  onPress={this.handleVerifyCode} />
              </View>
            }
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5
  },
  body: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    //borderWidth: 2
  },
  txtLabelContainer: {
    width: '90%',
  },
  txtLabel: {
    fontFamily: 'SFProText-Bold',
    fontSize: 14,
    color: 'white'
  },
  inputBoxContainer: {
    width: '90%',
    height: normalize(50, 'height'),
    marginTop: normalize(10, 'height')
  },
  txtInput: {
    backgroundColor: 'rgba(255,255,255,1)',
    height: '100%',
    borderRadius: 8,
    borderColor: Colors.blueColor,
    borderWidth: 1,
    paddingLeft: 15,
    color: Colors.blackColor
  },
  nextContainer: {
    width: '90%',
    marginTop: normalize(30, 'height')
  },
});